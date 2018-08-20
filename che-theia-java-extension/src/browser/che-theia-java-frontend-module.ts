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

import { JavaExtensionContribution } from './che-theia-java-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule, Container, interfaces } from "inversify";
import { KeybindingContribution, KeybindingContext, WidgetFactory, TreeProps, createTreeContainer, defaultTreeProps, TreeWidget } from '@theia/core/lib/browser';

import "../../src/browser/styles/icons.css";
import "../../src/browser/styles/classpath.css";
import { FileStructure } from './navigation/file-structure';
import { JavaEditorTextFocusContext } from './java-keybinding-contexts';
import { BuildPathTreeWidget } from './classpath/build-path-widget';
import { ClassPathDialog, DialogProps } from './classpath/classpath-dialog';
import { ClasspathResolver } from './classpath/classpath-resolver';
import { ClasspathContainer } from './classpath/classpath-container';
import { ClasspathRightModel } from './classpath/pages/classpath-right-model';

export default new ContainerModule((bind) => {

    bind(CommandContribution).to(JavaExtensionContribution);
    bind(MenuContribution).to(JavaExtensionContribution);
    bind(KeybindingContribution).to(JavaExtensionContribution);

    bind(FileStructure).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(KeybindingContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));

    bind(KeybindingContext).to(JavaEditorTextFocusContext).inSingletonScope();

    bind(ClasspathRightModel).toSelf().inSingletonScope();

    bind(ClassPathDialog).toSelf().inSingletonScope();
    bind(DialogProps).toConstantValue({ title: 'Configure Classpath' });
    
    bind(ClasspathResolver).toSelf().inSingletonScope();
    bind(ClasspathContainer).toSelf().inSingletonScope();
    
    bind(BuildPathTreeWidget).toDynamicValue(ctx =>
        createBuildPathTreeWidget(ctx.container)
    ).inSingletonScope();

    bind(WidgetFactory).toDynamicValue(context => ({
        id: "Build path tree widget",
        createWidget: () => context.container.get<BuildPathTreeWidget>(BuildPathTreeWidget)
    }));

});

export const PROPS_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: ["NAVIGATOR_CONTEXT_MENU"],
    multiSelect: false
};

export const PROPS_PROPS2 = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: ["NAVIGATOR_CONTEXT_MENU"],
    multiSelect: false
};

export function createBuildPathTreeWidgetContainer(parent: interfaces.Container): Container {
    const child = createTreeContainer(parent);

    child.rebind(TreeProps).toConstantValue(PROPS_PROPS);

    child.unbind(TreeWidget);
    child.bind(BuildPathTreeWidget).toSelf();

    return child;
}

export function createBuildPathTreeWidget(parent: interfaces.Container): BuildPathTreeWidget {
    return createBuildPathTreeWidgetContainer(parent).get(BuildPathTreeWidget);
}
