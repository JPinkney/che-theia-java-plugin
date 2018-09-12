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

import { injectable, inject } from "inversify";
import { CompositeTreeNode, TreeWidget } from "@theia/core/lib/browser";
import { SourceView } from "../pages/source/source-view";
import { IClasspathNode } from "./classpath-node";

@injectable()
export class SourceNode implements IClasspathNode {
    
    selected: boolean;
    widget: TreeWidget;
    id: string;
    name: string;
    parent: CompositeTreeNode | undefined;

    constructor(@inject(SourceView) protected readonly sourceView: SourceView) {
        this.selected = false;
        this.id = "Source node";
        this.name = this.id;
        this.widget = sourceView;
    }

}