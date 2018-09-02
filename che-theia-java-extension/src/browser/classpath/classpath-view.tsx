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

import { injectable, inject, multiInject } from 'inversify';
import { ContextMenuRenderer, TreeProps, TreeWidget, CompositeTreeNode, LabelProvider, TreeNode, NodeProps, TreeModel } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { ClasspathContainer, ClasspathEntry } from './classpath-container';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import * as React from 'react';
import { FileDialogService } from '@theia/filesystem/lib/browser';
import { IClasspathModel } from './pages/classpath-model';
import { ClasspathViewNode } from './node/classpath-node';

export interface ClasspathListNode {
    id: string,
    name: string
}

/**
 * This is the left side of the panel that holds the libraries and the source node
 */
@injectable()
export class ClasspathView extends TreeWidget {

    activeClasspathModel: IClasspathModel;
    classpathTreeModel: TreeModel;

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) classpathTreeModel: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @multiInject(IClasspathModel) protected readonly classpathModels: IClasspathModel[],
        @inject(FileDialogService) protected readonly fileDialogService: FileDialogService
    ) {
        super(props, classpathTreeModel, contextMenuRenderer);
        this.addClass('classpath-widget');
        this.activeClasspathModel = classpathModels[0];
        this.classpathTreeModel = classpathTreeModel;
    }

    async createClassPathTree() {
        const rootNode = {
            id: 'class-path-root',
            name: 'Java class path',
            visible: false,
            parent: undefined
        } as CompositeTreeNode;
        this.model.root = rootNode;
    }

    protected render(): React.ReactNode {
        this.classpathModelToTree();
        const tree = this.renderTree(this.classpathTreeModel);
        return (
            <div>
                <div id="right-view-left" className={'classpath-tree-left'}>
                    <h4>{ this.activeClasspathModel.classpathProps().title }</h4>
                    { tree }
                </div>      
            </div>
        );
    }

    protected renderIcon(node: TreeNode, props: NodeProps): React.ReactNode {
        return <div className={node.icon + " file-icon java-libraries-icon" }> </div>;
    }

    protected renderTailDecorations(node: TreeNode, props: NodeProps): React.ReactNode {
        return <div className={"java-remove-node-icon file-icon java-libraries-icon"} onClick={() => this.removeNode(node)}></div>;
    }

    protected removeNode(node: TreeNode) {
        const classpathViewNode = node as ClasspathViewNode;
        this.activeClasspathModel.removeClasspathNode(classpathViewNode);
        this.classpathContainer.removeClasspathEntry(classpathViewNode.classpathEntry);
    }

    private classpathModelToTree() {
        const rootNode = {
            id: 'class-path-root',
            name: 'Java class path',
            visible: false,
            parent: undefined,
            children: this.activeClasspathModel.classpathItems
        } as CompositeTreeNode;
        this.classpathTreeModel.root = rootNode;
    }

    isDirty(): boolean {
        let isDirty = false;
        this.classpathModels.forEach((classpathModel) => {
            console.log(classpathModel);
            if(classpathModel.isDirty){
                isDirty = true;
            }
        });
        return isDirty;
    }

    async openDialog() {
        const roots = await this.workspaceService.roots;
        if (roots) {
            const result = await this.fileDialogService.show(this.activeClasspathModel.classpathProps().dialogProps);
            // const rootUri = new URI(roots[0].uri);
            // const name = this.labelProvider.getName(rootUri);
            // const rootNode = DirNode.createRoot(roots[0], name, "");
            // dialog.model.navigateTo(rootNode);
            // const result = await dialog.open();

            // Make sure its all filtered or whatever and we got result
            if (result) {
                const newClasspathItem = {
                    children: [],
                    entryKind: 3,
                    path: result.fileStat.uri
                } as ClasspathEntry;
                this.activeClasspathModel.addClasspathNodes([newClasspathItem]);
                this.classpathContainer.resolveClasspathEntries([newClasspathItem]);
                this.update();
            }
        }
    }

    async save() {
        const roots = await this.workspaceService.roots;
        if (roots) {
            this.classpathContainer.updateClasspath(roots[0].uri);
        }
    }
}
