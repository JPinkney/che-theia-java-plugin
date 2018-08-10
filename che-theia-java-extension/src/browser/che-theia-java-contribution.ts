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

import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MAIN_MENU_BAR, Command } from "@theia/core/lib/common";
import { KeybindingContribution, KeybindingRegistry } from "@theia/core/lib/browser";
import { ClassPathDialog } from "./classpath/classpath-dialog";

export const HELP = [...MAIN_MENU_BAR, '5_classpath'];

export const ABOUT_COMMAND: Command = {
    id: 'core.about2',
    label: 'About2'
};

@injectable()
export class JavaExtensionContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    constructor(@inject(ClassPathDialog) protected readonly aboutDialog: ClassPathDialog) {

    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(ABOUT_COMMAND, {
            execute: () => this.aboutDialog.open()
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(HELP, {
            commandId: ABOUT_COMMAND.id,
            label: 'Configure Classpath',
            order: '10'
        });
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
