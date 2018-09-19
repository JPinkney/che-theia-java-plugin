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

import { ContainerModule } from "inversify";
import { KeybindingContribution, KeybindingContext, bindViewContribution, WidgetFactory } from '@theia/core/lib/browser';

import "../../src/browser/styles/icons.css";
import { FileStructure } from './navigation/file-structure';
import { FindImplementers } from './navigation/find-implementers';
import { JavaEditorTextFocusContext } from './java-keybinding-contexts';
import { UsagesContribution } from './usages/usages-frontend-contribution';
import { UsagesWidget, USAGES_ID } from './usages/usages-tree-widget';
import { createUsagesWidget } from './usages/usages-tree-container';

export default new ContainerModule((bind) => {

    bind(CommandContribution).to(JavaExtensionContribution);
    bind(MenuContribution).to(JavaExtensionContribution);
    bind(KeybindingContribution).to(JavaExtensionContribution);

    bind(FileStructure).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(KeybindingContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));

    bind(FindImplementers).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(FindImplementers));
    bind(KeybindingContribution).toDynamicValue(ctx => ctx.container.get(FindImplementers));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(FindImplementers));

    bind(KeybindingContext).to(JavaEditorTextFocusContext).inSingletonScope();

    bindViewContribution(bind, UsagesContribution);

    bind(UsagesWidget).toDynamicValue(ctx => {
        return createUsagesWidget(ctx.container)
    });

    bind(WidgetFactory).toDynamicValue(context => ({
        id: USAGES_ID,
        createWidget: () => context.container.get<UsagesWidget>(UsagesWidget)
    }));

});
