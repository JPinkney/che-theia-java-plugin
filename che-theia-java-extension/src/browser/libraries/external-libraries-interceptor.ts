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
import { FileSystemWatcher } from "@theia/filesystem/lib/browser/filesystem-watcher";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { ExternalLibrariesWidget } from "./external-libraries-widget";

@injectable()
export class ExternalLibrariesInterceptor extends DefaultFrontendApplicationContribution {

    constructor(@inject(FileSystemWatcher) protected readonly fileSystemWatcher: FileSystemWatcher,
            @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
            @inject(ExternalLibrariesWidget) protected readonly externalLibrariesWidget: ExternalLibrariesWidget) {
        super();
        this.intercept();
    }

    protected async intercept() {
        this.fileSystemWatcher.onFilesChanged(async e => {
            const contains = await this.workspaceService.containsSome(['pom.xml', '.gradle', '.project']);
            const root = await this.workspaceService.root;
            if (contains && root) {
                const node = this.externalLibrariesWidget.model.tree.getNode(root.uri);
                if (node) {
                    const ele = document.getElementById(node.id);
                    if (ele) {
                        Widget.attach(this.externalLibrariesWidget, ele);
                    }
                }
            } else {
                try {
                    Widget.detach(this.externalLibrariesWidget);
                } catch(e) {
                    console.log(e);
                }   
            }
        });
    }

}