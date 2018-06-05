/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from "inversify";
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { KeybindingContribution } from '@theia/core/lib/browser';

import { JavaExtensionCommandContribution } from './java-commands';

export default new ContainerModule(bind => {
    bind(JavaExtensionCommandContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toDynamicValue(ctx => ctx.container.get(JavaExtensionCommandContribution)).inSingletonScope();
    bind(KeybindingContribution).toDynamicValue(ctx => ctx.container.get(JavaExtensionCommandContribution)).inSingletonScope();
    bind(MenuContribution).toDynamicValue(ctx => ctx.container.get(JavaExtensionCommandContribution)).inSingletonScope();
});
