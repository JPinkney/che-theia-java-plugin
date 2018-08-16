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

/**
 * This node appears on the left side of the classpath and on selection updates the classpathTreeWidget.
 */
export class LibraryNode implements ClasspathNode {
    
    id: string;
    name: string;
    parent: Readonly<CompositeTreeNode>;
    previousSibling?: TreeNode | undefined;
    nextSibling?: TreeNode | undefined;
    selected: boolean;
    static LibraryTitle = "This is the library or whatever";
    
    constructor(parent: Readonly<CompositeTreeNode>) {
        this.parent = parent;
        this.name = "Library";
        this.id = this.name;
        this.selected = true;

    }

    async onSelect(classpathTreeWidget: ClasspathTreeWidget) {
        /**
         * We need to do a few things here
         * 1. Update the model by doing the call to jdt.ls
         * 2. Update the title to reflect the new view
         * 3. Potentially add action delegate for button
         */

        // const root = await this.workspaceService.root;
        // console.log(root);
        // console.log(root !== undefined);
        // if (root) {
        //     const results = await this.classpathContainer.getClassPathEntries(root.uri);

        //     const newModel = {
        //         id: 'build-path-root',
        //         name: 'Java build path',
        //         visible: true,
        //         parent: undefined
        //     } as CompositeTreeNode;

        //     let resultNodes: TreeNode[] = [];
        //     for (const result of results) {
        //         const resultNode = {
        //             id: result.path,
        //             name: result.path,
        //             parent: newModel
        //         } as TreeNode;
        //         resultNodes.push(resultNode);
        //     }

        //     newModel.children = resultNodes;
            
        // }
    }

}