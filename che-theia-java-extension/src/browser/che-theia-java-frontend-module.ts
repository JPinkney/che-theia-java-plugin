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
import { ClasspathContainer } from './classpath/classpath-container';
import { ClasspathView } from './classpath/classpath-view';
import { SourceModel } from './classpath/pages/source/source-model';
import { LibraryModel } from './classpath/pages/library/library-model';
import { ClasspathDecorator } from './classpath/classpath-tree-decorator';
import { IClasspathModel } from './classpath/pages/classpath-model';
import { MarkDirAsSourceAction } from './action/mark-dir-as-source';
import { UnmarkDirAsSourceAction } from './action/unmark-dir-as-source';
import { NavigatorTreeDecorator } from '@theia/navigator/lib/browser/navigator-decorator-service';

export default new ContainerModule((bind) => {

    bind(CommandContribution).to(JavaExtensionContribution);
    bind(MenuContribution).to(JavaExtensionContribution);
    bind(KeybindingContribution).to(JavaExtensionContribution);

    bind(FileStructure).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(KeybindingContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));

    bind(MarkDirAsSourceAction).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(MarkDirAsSourceAction));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(MarkDirAsSourceAction));

    bind(UnmarkDirAsSourceAction).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(UnmarkDirAsSourceAction));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(UnmarkDirAsSourceAction));

    bind(KeybindingContext).to(JavaEditorTextFocusContext).inSingletonScope();

    bind(ClassPathDialog).toSelf().inSingletonScope();
    bind(DialogProps).toConstantValue({ title: 'Configure Classpath' });

    bind(ClasspathContainer).toSelf().inSingletonScope();
    
    bind(LibraryModel).toSelf().inSingletonScope();
    bind(SourceModel).toSelf().inSingletonScope();

    bind(IClasspathModel).to(LibraryModel).inSingletonScope();
    bind(IClasspathModel).to(SourceModel).inSingletonScope();

    bind(BuildPathTreeWidget).toDynamicValue(ctx =>
        createBuildPathTreeWidget(ctx.container)
    ).inSingletonScope();

    bind(WidgetFactory).toDynamicValue(context => ({
        id: "Build path tree widget",
        createWidget: () => context.container.get<BuildPathTreeWidget>(BuildPathTreeWidget)
    }));

    bind(ClasspathView).toDynamicValue(ctx =>
        createClassPathTreeWidget(ctx.container)
    ).inSingletonScope();

    bind(WidgetFactory).toDynamicValue(context => ({
        id: "Build path tree widget 2",
        createWidget: () => context.container.get<ClasspathView>(ClasspathView)
    }));

    bind(ClasspathDecorator).toSelf().inSingletonScope();
    bind(NavigatorTreeDecorator).toService(ClasspathDecorator);

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

export function createClassPathTreeWidgetContainer(parent: interfaces.Container): Container {
    const child = createTreeContainer(parent);

    child.rebind(TreeProps).toConstantValue(PROPS_PROPS);

    child.unbind(TreeWidget);
    child.bind(ClasspathView).toSelf();

    return child;
}

export function createClassPathTreeWidget(parent: interfaces.Container): ClasspathView {
    return createClassPathTreeWidgetContainer(parent).get(ClasspathView);
}