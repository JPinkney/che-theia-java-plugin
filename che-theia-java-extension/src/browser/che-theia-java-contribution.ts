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

import { injectable } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, Command } from "@theia/core/lib/common";
import { KeybindingContribution, KeybindingRegistry } from "@theia/core/lib/browser";

/**
 * Find implementers
 */
export const FIND_IMPLEMENTERS: Command = {
    label: 'Java: Find Implementers',
    id: 'java.nav.findImplementers'
};


@injectable()
export class JavaExtensionContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    registerCommands(commands: CommandRegistry): void {
        // commands.registerCommand(FIND_IMPLEMENTERS, {
        //     execute: async () => {
        //         const editor = this.editorManager.currentEditor;
        //         if (!editor) {
        //             return false;
        //         }
        //         const uri = editor.editor.uri.toString();
        //         const client = await this.javaClientContribution.languageClient;
        //         const result = await client.sendRequest(ExecuteCommandRequest.type, {
        //             command: JAVA_ORGANIZE_IMPORTS.id,
        //             arguments: [
        //                 uri
        //             ]
        //         });
        //         if (isWorkspaceEdit(result) && this.workspace.applyEdit) {
        //             return await this.workspace.applyEdit(result);
        //         } else {
        //             return false;
        //         }
        //     },
        //     isVisible: () => !!this.editorManager.currentEditor,
        //     isEnabled: () => !!this.editorManager.currentEditor
        // });
    }

    registerMenus(menus: MenuModelRegistry): void {
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
