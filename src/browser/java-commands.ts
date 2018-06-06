/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { inject, injectable } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR, MessageService } from '@theia/core/lib/common';
import { EditorManager } from "@theia/editor/lib/browser";
import { KeybindingContribution, KeybindingRegistry } from "@theia/core/lib/browser";
import { Workspace } from "@theia/languages/lib/common";
import { JavaClientContribution } from "@theia/java/lib/browser/java-client-contribution";

export const HelloWorldCommand = {
    id: 'HelloWorld.command',
    label: "Shows a message"
};

@injectable()
export class JavaExtensionCommandContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    @inject(Workspace)
    protected readonly workspace: Workspace;

    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

    @inject(JavaClientContribution)
    protected readonly javaClientContribution: JavaClientContribution;

    @inject(MessageService)
    private readonly messageService: MessageService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(HelloWorldCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
