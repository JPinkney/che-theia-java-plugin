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

import { injectable, inject } from 'inversify';
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, CompositeTreeNode } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import * as React from 'react';
import { ClasspathNode } from './node/classpath-node';

@injectable()
export class ClasspathTreeWidget extends TreeWidget {

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) readonly model: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider
    ) {
        super(props, model, contextMenuRenderer);
        this.model.onSelectionChanged(e => {
            this.update();
        });
    }

    public createClassPathTree() {
        const rootNode = {
            id: 'classpath-root',
            name: 'Classpath Root',
            visible: false,
            parent: undefined
        } as CompositeTreeNode;
        rootNode.children = this.createClassPathTreeChildren(rootNode);
        this.model.root = rootNode;
    }

    private createClassPathTreeChildren(parent: Readonly<CompositeTreeNode>): ClasspathNode[] {
        const librariesNode = {
            id: "build-path-libraries-node2",
            name: "Some Tree Leaf 2",
            parent,
            visible: true,
            selected: true
        } as ClasspathNode;

        const sourceNode = {
            id: "build-path-sources-node2",
            name: "Some Tree Leaf 2",
            parent,
            visible: true,
            selected: false
        } as ClasspathNode;
        return [librariesNode, sourceNode];
    }

    protected render(): React.ReactNode {
        let leftView = super.render();
        return (
            <div>
                <h4>This will be the title</h4>
                { leftView }
                <button>Button with some text</button>
            </div>
        );
    }

}
