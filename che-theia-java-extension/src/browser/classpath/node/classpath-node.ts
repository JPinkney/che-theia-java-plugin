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
import { SelectableTreeNode } from "@theia/core/lib/browser/tree/tree-selection";
import { CompositeTreeNode } from "@theia/core/lib/browser/tree/tree";

export interface ClasspathNode extends SelectableTreeNode {
    viewOnClick: any;
}

export namespace ClasspathNode {
    export function create(id: string, name: string, viewOnClick: any, selected: boolean, parent: Readonly<CompositeTreeNode>): ClasspathNode {
        return <ClasspathNode>{
            id,
            name,
            viewOnClick,
            parent,
            selected
        };
    }
}