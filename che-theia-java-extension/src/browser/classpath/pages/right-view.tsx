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

import { ReactRenderer } from "@theia/core/lib/browser/widgets/react-renderer";
import * as React from 'react';
import { inject } from "inversify";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { FileDialogFactory, DirNode } from "@theia/filesystem/lib/browser";
import { LabelProvider } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { ClasspathRightModel } from "./classpath-right-model";

export interface ClasspathListNode {
    id: string,
    name: string
}

export class RightViewRenderer extends ReactRenderer {
    
    constructor(
    @inject(ClasspathRightModel) readonly classpathRightModel: ClasspathRightModel,
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
    @inject(FileDialogFactory) protected readonly fileDialogFactory: FileDialogFactory,
    @inject(LabelProvider) protected readonly labelProvider: LabelProvider) {
        super();
        this.classpathRightModel.onClasspathModelChanged(() => {
            this.render();
        });
    }

    protected doRender(): React.ReactNode {
        const classpathItems = this.classpathRightModel.classpathItems.map(value => this.renderClasspathItem(value));
        return (
            <div>
                <div id="right-view-left" className={'classpath-tree-left'}>
                    <h4>{ this.classpathRightModel.classpathModelProps.title }</h4>
                    { ...classpathItems }
                </div>                
                <div className={'classpath-button-right'}>
                    <button onClick={this.openDialog.bind(this)}>{ this.classpathRightModel.classpathModelProps.buttonText }</button>
                </div>
            </div>
        );
    }

    
    protected renderClasspathItem(classpathListNode: ClasspathListNode): React.ReactNode {
        return <div key={classpathListNode.id} className={'theia-TreeNode theia-TreeNodeContent'}>{classpathListNode.name}</div>;
    }
    
    async openDialog() {
        const root = await this.workspaceService.root;
        if (root) {
            const dialog = this.fileDialogFactory({ title: this.classpathRightModel.classpathModelProps.buttonText });
            const rootUri = new URI(root.uri);
            const name = this.labelProvider.getName(rootUri);
            const rootNode = DirNode.createRoot(root, name, "");
            dialog.model.navigateTo(rootNode);
            const result = await dialog.open();

            // Make sure its all filtered or whatever and we got result
            if (result) {
                this.classpathRightModel.classpathItems = this.classpathRightModel.classpathItems.concat({
                    id: result.id,
                    name: this.labelProvider.getName(result.uri)
                }); 
            }
        }
    }

}
