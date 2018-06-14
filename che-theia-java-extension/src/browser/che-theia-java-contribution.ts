/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, Command } from "@theia/core/lib/common";
import { KeybindingContribution, KeybindingRegistry, WidgetManager, CompositeTreeNode } from "@theia/core/lib/browser";
import { FileNavigatorWidget } from "@theia/navigator/lib/browser";
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { EditorManager } from "@theia/editor/lib/browser";
import { LibrariesTreeNode } from '../browser/external-libraries/librararies-node';
import { JarNode } from "./external-libraries/jar-node";
import { JarFileNode } from "./external-libraries/jar-file-node";

const EXTERNAL_LIBRARIES: Command = {
    id: "Java.External.Libraries",
    label: "Java: Add External Libraries"
};

@injectable()
export class JavaExtensionContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    @inject(WidgetManager)
    protected readonly widget!: WidgetManager;

    @inject(LanguageClientProvider)
    readonly languageClientProvider!: LanguageClientProvider;

    @inject(EditorManager)
    protected readonly editorManager!: EditorManager;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(EXTERNAL_LIBRARIES, {
            execute: async () => {
                this.widget.getWidget("files").then(async resolvedWidget => {
                    const editor = this.editorManager.currentEditor;
                    if (!editor) {
                        return false;
                    }
                    const uri = editor.editor.uri.toString();
                    const currentResolvedWidgetTyped = resolvedWidget as FileNavigatorWidget;
                    const currModelRoot = currentResolvedWidgetTyped.model.root as CompositeTreeNode;
                    const externalLibraryRootNode = new LibrariesTreeNode("External Libraries", "External Libraries", []);
                    Object.assign(currModelRoot.children, currModelRoot.children.concat([externalLibraryRootNode]));
                    const z = await this.languageClientProvider.getLanguageClient("java");
                    if (z) {
                        z.trace = 2;
                        currentResolvedWidgetTyped.model.onOpenNode(async event => {
                            if (event instanceof LibrariesTreeNode) {
                                event.resolveChildren(z);
                            }
                            if (event instanceof JarNode) {
                                event.resolveChildren(z, uri);
                            }
                            if (event instanceof JarFileNode) {
                                event.resolveChildren();
                            }
                            if (event instanceof JarFileNode) {
                                event.getFileContent(z);
                            }
                        });
                    }
                    currentResolvedWidgetTyped.update();
                });
            }
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
    }

    registerKeybindings(keybindings: KeybindingRegistry): void {
    }
}
