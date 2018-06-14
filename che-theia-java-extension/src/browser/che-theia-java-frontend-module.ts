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

import { JavaExtensionContribution } from './che-theia-java-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { KeybindingContribution, WidgetFactory, bindViewContribution } from '@theia/core/lib/browser';

import "../../src/browser/styles/icons.css";
import { UsagesContribution } from './usages/usages-frontend-contribution';
import { UsagesWidget, USAGES_ID } from './usages/usages-tree-widget';
import { createUsagesWidget } from './usages/usages-tree-container';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(JavaExtensionContribution);
    bind(MenuContribution).to(JavaExtensionContribution);
    bind(KeybindingContribution).to(JavaExtensionContribution);

    bindViewContribution(bind, UsagesContribution);

    bind(UsagesWidget).toDynamicValue(ctx => {
        return createUsagesWidget(ctx.container)
    });
    bind(WidgetFactory).toDynamicValue(context => ({
        id: USAGES_ID,
        createWidget: () => context.container.get<UsagesWidget>(UsagesWidget)
    }));
});
