/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable, inject } from 'inversify';
import { ContextMenuRenderer, TreeProps, LabelProvider, TreeWidget, TreeNode, NodeProps, TreeModel, WidgetManager } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import * as React from 'react';
import { FileDialogService, FileStatNode } from '@theia/filesystem/lib/browser';
import { ClasspathContainer, ClasspathEntry } from '../../classpath-container';
import { LibraryModel } from './library-model';
import { FILE_NAVIGATOR_ID, FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';
import { JavaUtils } from '../../../java-utils';

export interface ClasspathListNode {
    id: string,
    name: string
}

/**
 * This is the left side of the panel that holds the libraries and the source node
 */
@injectable()
export class LibraryView extends TreeWidget {

    classpathModel: LibraryModel;

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(LibraryModel) classpathModel: LibraryModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @inject(FileDialogService) protected readonly fileDialogService: FileDialogService,
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager
    ) {
        super(props, classpathModel, contextMenuRenderer);
        this.addClass('classpath-widget');
        this.classpathModel = classpathModel;
        this.setUpRoot();
    }

    private setUpRoot() {
        const rootNode = {
            id: 'build-path-root',
            name: 'Java build path',
            visible: true,
            parent: undefined
        } as TreeNode;
        this.model.root = rootNode;
    }
    
    protected renderTree(model: TreeModel): React.ReactNode {
        if (model.root) {
            return <TreeWidget.View
                ref={view => this.view = (view || undefined)}
                width={this.node.offsetWidth * 0.8}
                height={this.node.offsetHeight * 0.8}
                rows={Array.from(this.rows.values())}
                getNodeRowHeight={this.getNodeRowHeight}
                renderNodeRow={this.renderNodeRow}
                scrollToRow={this.scrollToRow}
            />;
        }
        return null;
    }
    
    protected render(): React.ReactNode {
        const tree = this.renderTree(this.classpathModel);
        return (
            <div>
                <div id="right-view-left" className={'classpath-tree-left'}>
                    <h4 className={'classpath-view-title'}>JARs and class folders on the build path</h4>
                    { tree }
                </div>
                <div className={'classpath-button-right'}>
                    <button onClick={this.openDialog.bind(this)}>Add Jar</button>
                </div>
            </div>
        );
    }

    protected renderIcon(node: TreeNode, props: NodeProps): React.ReactNode {
        return <div className={node.icon + " file-icon java-libraries-icon" }></div>;
    }

    async openDialog() {
        const roots = await this.workspaceService.roots;
        const fileModel = await this.widgetManager.getWidget(FILE_NAVIGATOR_ID) as FileNavigatorWidget;
        if (roots && fileModel) {
            const selectedNodes = fileModel.model.selectedFileStatNodes;
            const classpathURI = selectedNodes.length > 0 ? selectedNodes[0].uri.toString() : roots[0].uri;
            const actualURI = JavaUtils.getRootProjectURI(roots, classpathURI);
            if (actualURI) {
                const multiRootActualURI = JavaUtils.getMultiRootReadyURI(actualURI, actualURI);
                console.log("Multi root uri");
                console.log(multiRootActualURI);
                const fileStatNode = fileModel.model.getNode(multiRootActualURI) as FileStatNode;
            if (fileStatNode) {
                const fileStat = fileStatNode.fileStat;
                const result = await this.fileDialogService.show({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    filters: {
                        "jars": ["jar"]
                    },
                    title: "Add a jar"
                }, fileStat);
    
                // Make sure its all filtered or whatever and we got result
                if (result && result.uri.toString().endsWith('.jar')) {
                    const newClasspathItem = {
                        children: [],
                        entryKind: 3,
                        path: result.fileStat.uri
                    } as ClasspathEntry;
                    this.classpathModel.addClasspathNodes(newClasspathItem);
                    this.classpathContainer.resolveClasspathEntries([newClasspathItem]);
                    this.update();
                }
            }
            }
            
        }
        
    }

}
