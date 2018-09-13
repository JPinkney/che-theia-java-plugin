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

import { ClasspathEntry } from "../classpath-container";
import { TreeModelImpl, CompositeTreeNode } from "@theia/core/lib/browser";
import { ClasspathViewNode } from "../nodes/classpath-node";

export const IClasspathModel = Symbol('IClasspathModel');

export interface IClasspathModel extends TreeModelImpl {
    currentClasspathItems: Map<string, ClasspathViewNode>;
    addClasspathNodes(classpathItems: ClasspathEntry[] | ClasspathEntry): void;
    removeClasspathNode(path: string): void;
    isDirty: boolean;
    updateTree(): void;
}

export abstract class AbstractClasspathModel extends TreeModelImpl implements IClasspathModel {
    
    currentClasspathItems: Map<string, ClasspathViewNode>;
    isDirty = false;
    
    constructor() {
        super();
        this.currentClasspathItems = new Map();    
    }

    addClasspathNodes(classpathItems: ClasspathEntry | ClasspathEntry[]): void {
        throw new Error("Method not implemented.");
    }

    removeClasspathNode(path: string): void {
        this.isDirty = true;
        this.currentClasspathItems.delete(path);
        this.updateTree();
    }

    get classpathItems(): ClasspathViewNode[] {
        return Array.from(this.currentClasspathItems.values());
    }

    updateTree() {
        const rootNode = {
            id: 'class-path-root',
            name: 'Java class path',
            visible: false,
            parent: undefined,
            children: this.classpathItems
        } as CompositeTreeNode;
        this.root = rootNode;
    }

}