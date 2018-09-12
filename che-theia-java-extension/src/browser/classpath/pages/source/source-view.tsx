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
import { ContextMenuRenderer, TreeProps, LabelProvider, TreeNode, NodeProps, TreeWidget, TreeModel } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import * as React from 'react';
import { FileDialogService } from '@theia/filesystem/lib/browser';
import { ClasspathContainer, ClasspathEntry } from '../../classpath-container';
import { SourceModel } from './source-model';
import { ClasspathViewNode } from '../../nodes/classpath-node';

export interface ClasspathListNode {
    id: string,
    name: string
}

/**
 * This is the left side of the panel that holds the libraries and the source node
 */
@injectable()
export class SourceView extends TreeWidget {

    classpathModel: SourceModel;

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(SourceModel) classpathModel: SourceModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @inject(FileDialogService) protected readonly fileDialogService: FileDialogService
    ) {
        super(props, classpathModel, contextMenuRenderer);
        this.addClass('classpath-widget');
        this.addClass('source-widget');
        this.classpathModel = classpathModel;
        this.setUpRoot();
    }

    private setUpRoot() {
        const rootNode = {
            id: 'build-path-root',
            name: 'Java build path',
            visible: false,
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
                    <h4 className={'classpath-view-title'}>Source folders on build path</h4>
                    { tree }
                </div>
                <div className={'classpath-button-right'}>
                    <button onClick={this.openDialog.bind(this)}>Add source</button>
                </div>    
            </div>
        );
    }

    protected renderIcon(node: TreeNode, props: NodeProps): React.ReactNode {
        return <div className={node.icon + " file-icon java-libraries-icon" }></div>;
    }

    protected renderTailDecorations(node: TreeNode, props: NodeProps): React.ReactNode {
        return <div className={"java-remove-node-icon file-icon java-libraries-icon"} onClick={() => this.removeNode(node)}></div>;
    }

    protected removeNode(node: TreeNode) {
        const classpathViewNode = node as ClasspathViewNode;
        this.classpathModel.removeClasspathNode(classpathViewNode.classpathEntry.path);
        this.classpathContainer.removeClasspathEntry(classpathViewNode.classpathEntry);
    }

    async openDialog() {
        const roots = await this.workspaceService.roots;
        if (roots) {
            const result = await this.fileDialogService.show({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                title: "Add a folder"
            });

            // Make sure its all filtered or whatever and we got result
            if (result) {
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
