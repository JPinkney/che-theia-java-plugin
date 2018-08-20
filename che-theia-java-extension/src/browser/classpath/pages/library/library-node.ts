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

import { CompositeTreeNode } from "@theia/core/lib/browser";
import { ClasspathNode } from "../../node/classpath-node";
import { ClasspathContainer } from "../../classpath-container";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { ClasspathListNode } from "../classpath-view";
import { ClasspathEntryKind } from "../../classpath-resolver";
import { ClasspathRightModel } from "../classpath-right-model";

/**
 * This node appears on the left side of the classpath and on selection updates the classpathTreeWidget.
 */
export class LibraryNode implements ClasspathNode {
    
    static LibraryTitle = "This is the library or whatever";

    id: string;
    name: string;
    parent: Readonly<CompositeTreeNode>;
    selected: boolean;
    workspaceService: WorkspaceService;
    classpathContainer: ClasspathContainer;
    classpathModel: ClasspathRightModel;
    
    constructor(parent: Readonly<CompositeTreeNode>, workspaceService: WorkspaceService, classpathContainer: ClasspathContainer, classpathModel: ClasspathRightModel) {
        this.parent = parent;
        this.name = "Library";
        this.id = this.name;
        this.selected = true;
        this.workspaceService = workspaceService;
        this.classpathContainer = classpathContainer;
        this.classpathModel = classpathModel;
    }

    async onSelect(): Promise<void> {
        
        const root = await this.workspaceService.root;
        if (root) {

            const results = await this.classpathContainer.getClassPathEntries(root.uri);

            let resultNodes: ClasspathListNode[] = [];
            for (const result of results) {
                if (result.entryKind !== ClasspathEntryKind.CONTAINER && result.entryKind !== ClasspathEntryKind.LIBRARY) {
                    continue;
                }

                const resultNode = {
                    id: result.path,
                    name: result.path
                } as ClasspathListNode;
                resultNodes.push(resultNode);
            }

            this.classpathModel.classpathItems = resultNodes;
        }
    }

}