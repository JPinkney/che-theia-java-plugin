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
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, TreeNode, CompositeTreeNode } from '@theia/core/lib/browser';
export const FILE_NAVIGATOR_ID = 'files';
export const LABEL = 'Files';
export const CLASS = 'theia-Files';
import * as React from 'react';

/**
 * This is the right side of the panel that gets updated every time either Libraries or source is clicked
 */
@injectable()
export class ClasspathTreeWidget extends TreeWidget {

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) model: TreeModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer
    ) {
        super(props, model, contextMenuRenderer);
        this.id = FILE_NAVIGATOR_ID;
        this.title.label = LABEL;
        this.addClass(CLASS);
    }

    /** 
     * This will hold where we get the two initial nodes.
     * Perhaps we can make it general and instead put in both sides of classpath?
     */
    public setClasspathTree(children: TreeNode[]) {
        this.model.root = {
            id: 'classpath-view-root',
            name: 'Classpath Root',
            visible: false,
            children: children,
            parent: undefined
        } as CompositeTreeNode;
    }

    /**
     * What if we just bind this widget directly to the panel
     * This widget would then contain everything on the left hand and the right hand
     * I think it can work but is it worth it? hmm
     * We can probably get away with doing everything in this class for the right side so long as we have
     * the name of the nodes hmm Tree for each type of left side?
     */
    protected render(): React.ReactNode {
        const titleBar = React.createElement("h4", null, "test");
        const tree = React.createElement('div', this.createContainerAttributes(), this.renderTree(this.model));
        const action = undefined;
        return (
            <div>
                {titleBar}
                {tree}
                {action}
            </div>
        );
    }
}
