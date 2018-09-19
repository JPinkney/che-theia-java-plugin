/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable } from "inversify";
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { EDITOR_CONTEXT_MENU } from "@theia/editor/lib/browser";
import { MenuModelRegistry, Command, CommandRegistry } from "@theia/core";
import { KeybindingRegistry, OpenViewArguments } from "@theia/core/lib/browser";
import { UsagesWidget } from "./usages-tree-widget";

export const USAGES_TOGGLE_COMMAND_ID = 'usages:toggle';
export const USAGES_LABEL = 'Usages';

export namespace USAGES_COMMANDS {
    export const OPEN: Command = {
        id: 'usages:open',
        label: 'Open usages'
    };
}

@injectable()
export class UsagesContribution extends AbstractViewContribution<UsagesWidget> {

    constructor() {
        super({
            widgetId: "Usages",
            widgetName: USAGES_LABEL,
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: USAGES_TOGGLE_COMMAND_ID,
            toggleKeybinding: 'ctrlcmd+shift+0'
        });
    }

    protected JavaTreeAvailable(): boolean {
        return true;
    }

    async openView(args?: Partial<OpenViewArguments>): Promise<UsagesWidget> {
        const widget = await super.openView(args);
        widget.initializeModel();
        return widget;
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(USAGES_COMMANDS.OPEN, {
            execute: () => this.openView({
                toggle: false,
                activate: true
            }),
            isEnabled: this.JavaTreeAvailable.bind(this) //Need to change to is Java stuff
        });
        super.registerCommands(commands);
    }

    registerMenus(menus: MenuModelRegistry): void {
        const menuPath = [...EDITOR_CONTEXT_MENU, 'navigation'];
        menus.registerMenuAction(menuPath, {
            commandId: USAGES_COMMANDS.OPEN.id,
            label: USAGES_LABEL
        });
        super.registerMenus(menus);
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {    
        keybindings.registerKeybinding({
            command: USAGES_COMMANDS.OPEN.id,
            keybinding: 'ctrlcmd+f9'
        });
        super.registerKeybindings(keybindings);
    }

}
