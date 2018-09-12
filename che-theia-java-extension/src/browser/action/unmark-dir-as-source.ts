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

import { inject, injectable } from "inversify";
import { ClasspathContainer } from "../classpath/classpath-container";
import { CommandContribution, MenuContribution, SelectionService, CommandRegistry, MenuModelRegistry, Command } from "@theia/core";
import { UriAwareCommandHandler, UriCommandHandler } from "@theia/core/lib/common/uri-command-handler";
import URI from "@theia/core/lib/common/uri";
import { CompositeTreeNode, WidgetManager } from "@theia/core/lib/browser";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { FileNavigatorWidget, FILE_NAVIGATOR_ID } from "@theia/navigator/lib/browser/navigator-widget";
import { JavaUtils } from "../java-utils";
import { MARKSOURCEDIR } from "./mark-dir-as-source";
import { SourceView } from "../classpath/pages/source/source-view";

export const UNMARKSOURCEDIR: Command = {
    id: 'java:unmark-source-dir',
    label: 'Unmark Dir as Source'
};

@injectable()
export class UnmarkDirAsSourceAction implements CommandContribution, MenuContribution {

    constructor(@inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
                @inject(SelectionService) protected readonly selectionService: SelectionService,
                @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
                @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
                @inject(SourceView) protected readonly sourceView: SourceView
                ) {
    }

    async performAction(projectURI: string, treeNodeID: string) {
        const classpathItems = await this.classpathContainer.getClassPathEntries(projectURI);
        this.classpathContainer.clearClasspathEntries();
        const realID = JavaUtils.getIDFromMultiRootID(treeNodeID);
        const filteredClasspathItems = classpathItems.filter(item => item.path !== realID);
        this.classpathContainer.resolveClasspathEntries(filteredClasspathItems);
        this.classpathContainer.updateClasspath(projectURI);
        this.sourceView.classpathModel.removeClasspathNode(realID);
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(UNMARKSOURCEDIR, this.newUriAwareCommandHandler({
            execute: async fileUri => {
                const fileWidget = await this.widgetManager.tryGetWidget(FILE_NAVIGATOR_ID) as FileNavigatorWidget;
                if (fileWidget) {
                    
                    const roots = await this.workspaceService.roots;
                    const root = JavaUtils.getRootProjectURI(roots, fileUri.toString());
                    if (roots && root) {
                        const multiRootURI = JavaUtils.getMultiRootReadyURI(root, fileUri.toString());
                        const treeNode = fileWidget.model.getNode(multiRootURI);
                        if (treeNode && CompositeTreeNode.is(treeNode)) {
                            this.performAction(root, treeNode.id);   
                        }
                    }
                }
                
            }
        }));
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(MARKSOURCEDIR, {
            commandId: UNMARKSOURCEDIR.id
        });
    }

    protected newUriAwareCommandHandler(handler: UriCommandHandler<URI>): UriAwareCommandHandler<URI> {
        return new UriAwareCommandHandler(this.selectionService, handler);
    }
}