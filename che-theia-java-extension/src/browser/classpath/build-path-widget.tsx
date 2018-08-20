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
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, CompositeTreeNode } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { ClasspathNode } from './node/classpath-node';
import { SourceNode } from './pages/source/source-node';
import { LibraryNode } from './pages/library/library-node';
import { ClasspathContainer } from './classpath-container';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ClasspathRightModel } from './pages/classpath-right-model';

/**
 * This is the left side of the panel that holds the libraries and the source node
 */
@injectable()
export class BuildPathTreeWidget extends TreeWidget {

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) readonly model: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
        @inject(ClasspathRightModel) protected readonly classpathRightModel: ClasspathRightModel
    ) {
        super(props, model, contextMenuRenderer);
        this.addClass('classpath-widget');
        this.model.onSelectionChanged(async e => {
            const clickedNode = e[0] as ClasspathNode;
            clickedNode.onSelect();
            this.update();
        });
    }

    async createBuildPathTree() {
        const rootNode = {
            id: 'build-path-root',
            name: 'Java build path',
            visible: true,
            parent: undefined
        } as CompositeTreeNode;
        rootNode.children = await this.createBuildPathTreeChildren(rootNode);
        this.model.root = rootNode;
    }

    async createBuildPathTreeChildren(parent: Readonly<CompositeTreeNode>): Promise<ClasspathNode[]> {
        const libraryNode = new LibraryNode(parent, this.workspaceService, this.classpathContainer, this.classpathRightModel);
        
        const sourceNode = new SourceNode(parent, this.workspaceService, this.classpathContainer, this.classpathRightModel);
        return [libraryNode, sourceNode];
    }

}
