/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which is available at http://www.eclipse.org/legal/epl-2.0.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { injectable, inject } from 'inversify';
import { ContextMenuRenderer, TreeProps, TreeNode, NodeProps, TreeWidget } from '@theia/core/lib/browser';
import { h } from '@phosphor/virtualdom';
import { ExternalLibraryModel } from './external-libraries-model';

export const EXTERNAL_LIBRARIES_ID = 'External Libraries';

@injectable()
export class ExternalLibrariesWidget extends TreeWidget {

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer,
        @inject(ExternalLibraryModel) readonly model: ExternalLibraryModel
    ) {
        super(props, model, contextMenuRenderer);
        this.id = EXTERNAL_LIBRARIES_ID;
    }

    protected renderIcon(node: TreeNode, props: NodeProps): h.Child {
        return h.div({
            className: node.icon + " file-icon java-libraries-icon" 
        });
    }

}
