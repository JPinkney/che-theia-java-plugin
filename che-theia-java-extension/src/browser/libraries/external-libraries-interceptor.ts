/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
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

import { injectable, inject } from "inversify";
import { DefaultFrontendApplicationContribution, Widget } from "@theia/core/lib/browser";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { ExternalLibrariesWidget } from "./external-libraries-widget";
import { LibraryNode } from "./external-libraries-tree";


@injectable()
export class ExternalLibrariesInterceptor extends DefaultFrontendApplicationContribution {

    constructor(@inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
            @inject(ExternalLibrariesWidget) protected readonly externalLibrariesWidget: ExternalLibrariesWidget) {
        super();
        this.addExternalLibrariesIfNeeded();
    }


    private async addExternalLibrariesIfNeeded() {
        const isJavaProject = await this.workspaceService.containsSome(['pom.xml', '.gradle']);
        const workspaceRoot = await this.workspaceService.root;
        
        if (!workspaceRoot) {
            return;   
        }

        if (!isJavaProject && this.isExternalLibrariesNodePresent(workspaceRoot.uri)) {
            this.removeExternalLibrariesWidget();
        } else if (isJavaProject && !this.isExternalLibrariesNodePresent(workspaceRoot.uri)) {
            this.addExternalLibrariesWidget(workspaceRoot.uri);
        }
    }

    private isExternalLibrariesNodePresent(workspaceRootUri: string): boolean {
        const node = this.externalLibrariesWidget.model.tree.getNode("LibraryNode" + workspaceRootUri);
        if (node) {
            return document.getElementById(node.id) !== null;
        }
        return false;
    }

    /**
     * Remove external libraries node if present else do nothing
     */
    private removeExternalLibrariesWidget(): void {
        if (this.isExternalLibrariesNodePresent) {
            Widget.detach(this.externalLibrariesWidget);
        }
    }

    /**
     * Add external libraries node if not present else do nothing
     */
    private addExternalLibrariesWidget(workspaceRootUri: string): void {
        if (!this.isExternalLibrariesNodePresent(workspaceRootUri)) {
            // const folderRoot = this.fileNavigatorModel.root;
            // if (folderRoot) {
                this.externalLibrariesWidget.model.tree.root = LibraryNode.create(workspaceRootUri, undefined);
                const folderRootLocation = document.getElementById(workspaceRootUri);
                if (folderRootLocation) {
                    Widget.attach(this.externalLibrariesWidget, folderRootLocation);
                }
            }
        //}
    }

}