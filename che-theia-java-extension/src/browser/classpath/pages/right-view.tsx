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
import { LanguageClientProvider } from "@theia/languages/lib/browser/language-client-provider";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { FileDialogFactory, DirNode } from "@theia/filesystem/lib/browser";
import { LabelProvider } from "@theia/core/lib/browser";
import { ClasspathResolver } from "../classpath-resolver";
import URI from "@theia/core/lib/common/uri";
import { ClasspathRightModel } from "./classpath-right-model";
import { ClasspathListRenderer } from "./classpath-view";

export const ClasspathProps = Symbol('ClasspathProps');
export interface ClasspathProps {

    /**
     * The title of the right panel
     */
    readonly title: string

    /**
     * The text of the button
     */
    readonly buttonText: string;

    /**
     * The filter for items in the open dialog
     */
    readonly openDialogFilter: any[];

    /**
     * dialog title when button is clicked
     */
    readonly dialogTitle: string;
}

export class RightViewRenderer extends ReactRenderer {

    @inject(LanguageClientProvider) protected readonly languageClientProvider!: LanguageClientProvider;
    @inject(WorkspaceService) protected readonly workspaceService!: WorkspaceService;
    @inject(FileDialogFactory) protected readonly fileDialogFactory!: FileDialogFactory;
    @inject(LabelProvider) protected readonly labelProvider!: LabelProvider;
    @inject(ClasspathResolver) protected readonly classpathResolver!: ClasspathResolver;
    @inject(ClasspathRightModel) protected readonly classpathRightModel!: ClasspathRightModel;

    constructor(@inject(ClasspathProps) protected readonly classpathProps: ClasspathProps) {
        super();
    }

    protected doRender(): React.ReactNode {
        const r = new ClasspathListRenderer();
        r.render();
        const host = r.host.toString();
        console.log(host);
        return (
            <div>
                <div id="right-view-left" className={'classpath-tree-left'}>
                    <h4>{ this.classpathProps.title }</h4>
                    { host }
                </div>                
                <div className={'classpath-button-right'}>
                    <button onClick={this.openDialog.bind(this)}>{this.classpathProps.buttonText}</button>
                </div>
            </div>
        );
    }

    async openDialog() {
        const root = await this.workspaceService.root;
        if (root) {
            const dialog = this.fileDialogFactory({ title: this.classpathProps.dialogTitle });
            const rootUri = new URI(root.uri);
            const name = this.labelProvider.getName(rootUri);
            const rootNode = DirNode.createRoot(root, name, "");
            dialog.model.navigateTo(rootNode);
            const result = await dialog.open();

            // Make sure its all filtered or whatever and we got result
            if (result) {
                this.classpathRightModel.classpathItems.push(result);
            }
        }
    }

}
