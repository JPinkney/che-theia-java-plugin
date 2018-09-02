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

import { injectable, inject, multiInject } from 'inversify';
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, CompositeTreeNode, LabelProvider } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { ClasspathNode } from './node/classpath-node';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ClasspathView } from './classpath-view';
import { ClasspathContainer } from './classpath-container';
import { IClasspathModel } from './pages/classpath-model';

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
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @inject(ClasspathView) protected readonly classpathTreeWidget: ClasspathView,
        @multiInject(IClasspathModel) protected readonly classpathModels: IClasspathModel[]
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
        const roots = await this.workspaceService.roots;
        if (roots) {
            const classpathNodes = await this.classpathContainer.getClassPathEntries(roots[0].uri);         

            this.classpathContainer.resolveClasspathEntries(classpathNodes);
            const libraryNode = this.createLibraryNode(parent, classpathNodes);
            const sourceNode = this.createSourceNode(parent, classpathNodes);
            return [libraryNode, sourceNode];
        }
        return [];
    }

    private createLibraryNode(parent: Readonly<CompositeTreeNode>, classpathNodes: any[]) {
        this.classpathModels[0].addClasspathNodes(classpathNodes);
        const libraryNode = {
            id: "Library",
            name: "Library",
            selected: true,
            icon: "",
            parent: parent,
            onSelect: () => {
                this.classpathTreeWidget.activeClasspathModel = this.classpathModels[0];
            }
        } as ClasspathNode;
        return libraryNode;
    }

    private createSourceNode(parent: Readonly<CompositeTreeNode>, classpathNodes: any[]) {
        this.classpathModels[1].addClasspathNodes(classpathNodes);
        const sourceNode = {
            id: "Source",
            name: "Source",
            selected: false,
            icon: "",
            parent: parent,
            onSelect: () => {
                this.classpathTreeWidget.activeClasspathModel = this.classpathModels[1];
            }
        } as ClasspathNode;
        return sourceNode;
    }

}
