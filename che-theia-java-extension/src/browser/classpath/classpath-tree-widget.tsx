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
import { ContextMenuRenderer, TreeProps, TreeWidget, CompositeTreeNode, TreeNode, LabelProvider, TreeModel } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import * as React from 'react';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileDialogFactory, DirNode, FileStatNode } from '@theia/filesystem/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { ClasspathResolver } from './classpath-resolver';
import { ClasspathModel } from './classpath-model';

@injectable()
export class ClasspathTreeWidget extends TreeWidget {

    private panelTitle: string = "";
    isDirty = false;

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(ClasspathModel) model: ClasspathModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(FileDialogFactory) protected readonly fileDialogFactory: FileDialogFactory,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @inject(ClasspathResolver) protected readonly classpathResolver: ClasspathResolver
    ) {
        super(props, model, contextMenuRenderer);
        this.addClass('classpath-widget');
    }

    public createClassPathTree() {
        const rootNode = {
            id: 'classpath-root',
            name: 'Classpath Root',
            visible: false,
            parent: undefined,
            children: []
        } as CompositeTreeNode;
        this.model.root = rootNode;
    }

    updateWidget(title: string, model: TreeNode[]) {
        if (CompositeTreeNode.is(this.model.root)) {
            this.model.root.children = model;
            this.model.refresh();
        }
        this.panelTitle = title;
        this.update();
    }

    protected render(): React.ReactNode {
        let leftView = super.render();
        return (
            <div>
                <div className={'classpath-tree-left'}>
                    <h4>{ this.panelTitle }</h4>
                    { leftView }
                </div>                
                <div className={'classpath-button-right'}>
                    <button onClick={this.buttonstuff.bind(this)}>Add Folder</button>
                </div>
            </div>
        );
    }

    async buttonstuff() {
        const root = await this.workspaceService.root;
        if (root) {
            const dialog = this.fileDialogFactory({ title: "Open Folder" });
            const rootUri = new URI(root.uri);
            const name = this.labelProvider.getName(rootUri);
            const rootNode = DirNode.createRoot(root, name, "");
            dialog.model.navigateTo(rootNode);
            const result = await dialog.open();
            console.log("Clicked items are: ");
            console.log(result);

            // We need to check if its folder or whatever
            if (result) {
                this.addNode(result);
            }
        }
    }

    async save() {
        const root = await this.workspaceService.root;
        if (root) {
            this.classpathResolver.updateClasspath(root.uri);    
        }
    }

    private addNode(node: FileStatNode) {
        if (CompositeTreeNode.is(this.model.root)) {
            this.isDirty = true;

            node.fileStat.children = [];
            const newNode = this.fileStatToTreeRegularNode(node);
            this.model.root.children = this.model.root.children.concat(newNode);
            this.model.tree.addNode(newNode);
            this.model.refresh();
        }
    }

    private fileStatToTreeRegularNode(node: FileStatNode): TreeNode {
        return {
            id: node.id,
            name: node.name,
            parent: this.model.root
        } as TreeNode;
    }

    // private removeNode(node: ClasspathNode) {
    //     if (CompositeTreeNode.is(this.model.root)) {
    //         this.isDirty = true;
    //         this.model.root.children = this.model.root.children.filter(e => e.id !== node.id);
    //         this.model.refresh();
    //     }
    // }

}
