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
    MenuContribution,
    ResourceResolver
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { KeybindingContribution, KeybindingContext, WidgetFactory } from '@theia/core/lib/browser';

import { FileStructure } from './navigation/file-structure';
import { JavaEditorTextFocusContext } from './java-keybinding-contexts';

import { ExternalLibrariesWidget } from './libraries/external-libraries-widget';
import { createExternalLibrariesWidget } from './libraries/external-libraries-container';
import { FileNavigatorWidget } from '@theia/navigator/lib/browser';
import { CheLibResourceResolver } from './libraries/chelib-resource-provider';

import "../../src/browser/styles/icons.css";

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(CommandContribution).to(JavaExtensionContribution);
    bind(MenuContribution).to(JavaExtensionContribution);
    bind(KeybindingContribution).to(JavaExtensionContribution);

    bind(FileStructure).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(KeybindingContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(FileStructure));

    bind(KeybindingContext).to(JavaEditorTextFocusContext).inSingletonScope();
    bind(CheLibResourceResolver).toSelf().inSingletonScope();
    bind(ResourceResolver).toDynamicValue(ctx => ctx.container.get(CheLibResourceResolver));

    if(isBound(FileNavigatorWidget)){
        unbind(FileNavigatorWidget);
    }   
    
    bind(ExternalLibrariesWidget).toDynamicValue(ctx => {
        return createExternalLibrariesWidget(ctx.container)
    });
    bind(WidgetFactory).toDynamicValue(context => ({
        id: "files",
        createWidget: () => context.container.get<ExternalLibrariesWidget>(ExternalLibrariesWidget)
    }));
});
