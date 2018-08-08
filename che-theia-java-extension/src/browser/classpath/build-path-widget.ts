/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
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

import { injectable, inject } from 'inversify';
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, TreeNode, CompositeTreeNode, SelectableTreeNode } from '@theia/core/lib/browser';
import { ClasspathTreeWidget } from './classpath-tree-widget';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
export const FILE_NAVIGATOR_ID = 'files';
export const LABEL = 'Files';
export const CLASS = 'theia-Files';

export interface ClasspathNode extends SelectableTreeNode {
    onSelect: Function;
}

/**
 * This is the left side of the panel that holds the libraries and the source node
 */
@injectable()
export class BuildPathTreeWidget extends TreeWidget {

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) readonly model: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(ClasspathTreeWidget) protected readonly classpathTreeWidget: ClasspathTreeWidget,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider
    ) {
        super(props, model, contextMenuRenderer);
        this.id = FILE_NAVIGATOR_ID;
        this.title.label = LABEL;
        this.addClass(CLASS);
        this.model.onSelectionChanged(e => {
            const firstNode = e[0] as ClasspathNode;
            firstNode.onSelect();
        });
    }

    public createBuildPathTree() {
        const rootNode = {
            id: 'build-path-root',
            name: 'Java build path',
            visible: true,
            parent: undefined
        } as CompositeTreeNode;
        rootNode.children = this.createBuildPathTreeChildren(rootNode);
        this.model.root = rootNode;
    }

    private createBuildPathTreeChildren(parent: Readonly<CompositeTreeNode>): ClasspathNode[] {
        const librariesNode = {
            id: "build-path-libraries-node",
            name: "Libraries",
            parent,
            selected: true,
            onSelect: this.libraryOnSelect
        } as ClasspathNode;

        const sourceNode = {
            id: "build-path-sources-node",
            name: "Sources",
            parent,
            selected: false,
            onSelect: this.sourcesOnSelect
        } as ClasspathNode;
        return [librariesNode, sourceNode];
    }

    private async libraryOnSelect() {
        const javaClient = await this.languageClientProvider.getLanguageClient("java");
            if (javaClient) {
                const result = await javaClient.sendRequest(ExecuteCommandRequest.type, {
                    command: GET_CLASS_PATH_TREE_COMMAND,
                    arguments: [
                        projectPath
                    ]
                });
                this.classpath.set(projectPath, result);
                return result;
            } 
    }

    private async sourcesOnSelect() {
        const client = await this.languageClientProvider.getLanguageClient("java");
    }

}
