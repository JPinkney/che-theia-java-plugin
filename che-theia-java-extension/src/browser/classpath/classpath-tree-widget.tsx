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
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, CompositeTreeNode, TreeNode, LabelProvider } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { FileDialogService } from './file-dialog-service';
import * as React from 'react';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileDialogFactory, DirNode } from '@theia/filesystem/lib/browser';
import URI from '@theia/core/lib/common/uri';
// import { ClasspathNode } from './node/classpath-node';

@injectable()
export class ClasspathTreeWidget extends TreeWidget {

    private panelTitle: string = "";

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) readonly model: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(FileDialogService) protected readonly fileDialogService: FileDialogService,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(FileDialogFactory) protected readonly fileDialogFactory: FileDialogFactory,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider
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

            // We need to save this to jdt.ls perhaps do something else as well?
        }
    }

    storeChanges() {
        // UPDATE_PROJECT_CLASSPATH
    }

}
