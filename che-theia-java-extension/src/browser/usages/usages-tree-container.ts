/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { Container, interfaces } from 'inversify';
import { TreeProps, defaultTreeProps, TreeWidget, createTreeContainer } from "@theia/core/lib/browser";
import { UsagesWidget } from './usages-tree-widget';

export const FILE_NAVIGATOR_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: ['navigator-context-menu2'],
    multiSelect: false
};

export function createUsagesTreeContainer(parent: interfaces.Container): Container {
    const child = createTreeContainer(parent);

    child.unbind(TreeWidget);
    child.bind(UsagesWidget).toSelf();

    return child;
}

export function createUsagesWidget(parent: interfaces.Container): UsagesWidget {
    return createUsagesTreeContainer(parent).get(UsagesWidget);
}
