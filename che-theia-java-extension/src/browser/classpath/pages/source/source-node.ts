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

import { TreeNode, CompositeTreeNode } from "@theia/core/lib/browser";
import { ClasspathTreeWidget } from "../../classpath-tree-widget";
import { ClasspathNode } from "../../node/classpath-node";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { ClasspathContainer } from "../../classpath-container";

export class SourceNode implements ClasspathNode {
    
    static SourceTitle = "This is the Source stuff or whatever";

    id: string;
    name: string;
    parent: Readonly<CompositeTreeNode>;
    previousSibling?: TreeNode | undefined;
    nextSibling?: TreeNode | undefined;
    selected: boolean;
    workspaceService: WorkspaceService;
    classpathContainer: ClasspathContainer;
    
    constructor(parent: Readonly<CompositeTreeNode>, workspaceService: WorkspaceService, classpathContainer: ClasspathContainer) {
        this.parent = parent;
        this.name = "Source";
        this.id = this.name;
        this.selected = false;
        this.workspaceService = workspaceService;
        this.classpathContainer = classpathContainer;
    }

    async onSelect(classpathTreeWidget: ClasspathTreeWidget) {
        /**
         * We need to do a few things here
         * 1. Update the model by doing the call to jdt.ls
         * 2. Update the title to reflect the new view
         * 3. Potentially add action delegate for button
         */
        
        this.createClassPathTree(classpathTreeWidget);
    }

    public createClassPathTree(classpathTreeWidget: ClasspathTreeWidget) {
        if (classpathTreeWidget.model.root) {
            const nodes = this.createClassPathTreeChildren(classpathTreeWidget.model.root);
            classpathTreeWidget.updateWidget(SourceNode.SourceTitle, nodes);
        }
    }

    private createClassPathTreeChildren(parent: TreeNode): TreeNode[] {
        const librariesNode = {
            id: "build-path-libraries-node3",
            name: "This is new node",
            parent,
            selected: false
        } as ClasspathNode;
        const librariesNode2 = {
            id: "build-path-libraries-node4",
            name: "This is new node sdfsdf",
            parent,
            selected: false
        } as ClasspathNode;
        return [librariesNode, librariesNode2];
    }

}