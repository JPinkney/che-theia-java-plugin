/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { inject, injectable } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR } from '@theia/core/lib/common';
import { EditorManager } from "@theia/editor/lib/browser";
import { KeybindingContribution, KeybindingRegistry } from "@theia/core/lib/browser";
import { Workspace } from "@theia/languages/lib/common";
import { JavaClientContribution } from "@theia/java/lib/browser/java-client-contribution";

@injectable()
export class JavaExtensionCommandContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    @inject(Workspace)
    protected readonly workspace: Workspace;

    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

    @inject(JavaClientContribution)
    protected readonly javaClientContribution: JavaClientContribution;

    registerCommands(commands: CommandRegistry): void {
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction([...MAIN_MENU_BAR, '1_tester'], {
            commandId: "test",
            label: 'Testing to see if this works'
        });
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
