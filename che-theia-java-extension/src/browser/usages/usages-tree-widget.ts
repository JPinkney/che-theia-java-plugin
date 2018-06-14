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

import { injectable, inject } from 'inversify';
import { TreeWidget, TreeProps, ContextMenuRenderer, TreeModel } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { EditorManager } from '@theia/editor/lib/browser';
import { TextDocumentIdentifier, TextDocumentPositionParams, ExecuteCommandRequest } from '@theia/languages/lib/browser';
import { USAGES_COMMAND } from '../che-ls-jdt-commands';
import { UsagesResponse } from './usages-nodes';
import { UsagesNode } from './nodes/usages-node';

export const USAGES_ID = 'Usages';
export const LABEL = 'Usages';
export const CLASS = 'theia-Usages';

@injectable()
export class UsagesWidget extends TreeWidget {
 
    constructor(@inject(TreeProps) readonly props: TreeProps,
    @inject(TreeModel) model: TreeModel,
    @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer,
    @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
    @inject(EditorManager) protected readonly editorManager: EditorManager
    ) {
        super(props, model, contextMenuRenderer);
        this.id = USAGES_ID;
        this.title.label = LABEL;
        this.addClass(CLASS);
    }

    async initializeModel(): Promise<void> {
        const javaClient = await this.languageClientProvider.getLanguageClient("java");

        if (!javaClient) {
            return;
        }

        if (!this.editorManager) {
            return;
        }

        const currEditor = this.editorManager.currentEditor;

        if (!currEditor) {
            return;
        }
        
        const cursorPosition = currEditor.editor.cursor;
        const textDocumentIdentifier = {
            uri: currEditor.editor.document.uri
        } as TextDocumentIdentifier;

        const parameters = {
            position: cursorPosition,
            textDocument: textDocumentIdentifier
        } as TextDocumentPositionParams;

        console.log(parameters);

        const response = await javaClient.sendRequest(ExecuteCommandRequest.type, {
            command: USAGES_COMMAND,
            arguments: [
                {
                    parameters
                }
            ]
        }) as UsagesResponse;

        console.log("Response");
        console.log(response);

        const rootNode = new UsagesNode(response, undefined);
        this.model.root = rootNode;
    }

    
}
