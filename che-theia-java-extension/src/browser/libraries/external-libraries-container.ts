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

import { Container, interfaces } from 'inversify';
import { TreeModel, TreeProps, defaultTreeProps, Tree } from "@theia/core/lib/browser";
import { createFileTreeContainer, FileTreeModel } from '@theia/filesystem/lib/browser';
import { ExternalLibrariesWidget } from './external-libraries-widget';
import { FileNavigatorTree } from '@theia/navigator/lib/browser/navigator-tree';
import { ExternalLibrariesTree } from './external-libraries-tree';
import { ExternalLibraryModel } from './external-libraries-model';

export const FILE_NAVIGATOR_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: ['navigator-context-menu'],
    multiSelect: false
};

export function createExternalLibrariesContainer(parent: interfaces.Container): Container {
    const child = createFileTreeContainer(parent);

    child.bind(FileNavigatorTree).toSelf();
    child.bind(ExternalLibrariesTree).toSelf();
    child.rebind(Tree).toDynamicValue(ctx => ctx.container.get(ExternalLibrariesTree));

    child.unbind(FileTreeModel);
    child.bind(ExternalLibraryModel).toSelf();
    child.rebind(TreeModel).toDynamicValue(ctx => ctx.container.get(ExternalLibraryModel));

    child.bind(ExternalLibrariesWidget).toSelf();

    child.rebind(TreeProps).toConstantValue(FILE_NAVIGATOR_PROPS);

    return child;
}

export function createExternalLibrariesWidget(parent: interfaces.Container): ExternalLibrariesWidget {
    return createExternalLibrariesContainer(parent).get(ExternalLibrariesWidget);
}
