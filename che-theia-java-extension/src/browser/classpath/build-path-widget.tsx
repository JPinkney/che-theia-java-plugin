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
import { ContextMenuRenderer, TreeProps, TreeModel, TreeWidget, CompositeTreeNode, LabelProvider, Widget, WidgetManager } from '@theia/core/lib/browser';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ClasspathContainer } from './classpath-container';
import { IClasspathModel } from './pages/classpath-model';
import { IClasspathNode } from './nodes/classpath-node';
import { LibraryView } from './pages/library/library-view';
import { FILE_NAVIGATOR_ID, FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';
import { AbstractClasspathTreeWidget } from './pages/classpath-tree-widget';

/**
 * This is the left side of the panel that holds the libraries and the source node
 */
@injectable()
export class BuildPathTreeWidget extends TreeWidget {

    activeWidget: Widget | undefined;

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TreeModel) readonly model: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer,
        @inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @multiInject(IClasspathNode) readonly classpathNodes: IClasspathNode[],
        @inject(LibraryView) protected readonly libraryView: LibraryView,
        @inject(WidgetManager) protected readonly widgetManager: WidgetManager
    ) {
        super(props, model, contextMenuRenderer);
        this.addClass('classpath-widget');
        this.model.onSelectionChanged(async e => {
            const clickedNode = e[0] as IClasspathNode;
            const p = document.getElementById("classpath-panel-right");
            if (p) {
                if (this.activeWidget) {
                    Widget.detach(this.activeWidget);
                }
               
                Widget.attach(clickedNode.widget, p);
                clickedNode.widget.update();
                this.activeWidget = clickedNode.widget;
                this.update();
            }
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

    async createBuildPathTreeChildren(parent: Readonly<CompositeTreeNode>): Promise<IClasspathNode[]> {
        const roots = await this.workspaceService.roots;
        const fileModel = await this.widgetManager.getWidget(FILE_NAVIGATOR_ID) as FileNavigatorWidget;
        if (roots && fileModel) {
            const selectedNodes = fileModel.model.selectedFileStatNodes;
            const classpathURI = selectedNodes.length > 0 ? selectedNodes[0].fileStat : roots[0];
            const classpathNodes = await this.classpathContainer.getClassPathEntries(classpathURI.uri.toString());         
            this.classpathContainer.resolveClasspathEntries(classpathNodes);
            for (const classpathNode of this.classpathNodes) {
                const classpathWidget = classpathNode.widget as AbstractClasspathTreeWidget;
                classpathWidget.activeFileStat = classpathURI;
                const c = classpathWidget.model as IClasspathModel;
                c.addClasspathNodes(classpathNodes);
            }
            this.classpathContainer.onClasspathModelChangeEmitter.fire({
                classpathItems: classpathNodes,
                uri: roots[0].uri
            });
            return this.classpathNodes;
        }
        return [];
    }

    isDirty(): boolean {
        for (const c of this.classpathNodes) {
            const model = c.widget.model as IClasspathModel;
            if (model.isDirty) {
                return true;
            }
        }
        return false;
    }

    async save() {
        const roots = await this.workspaceService.roots;
        const fileModel = await this.widgetManager.getWidget(FILE_NAVIGATOR_ID) as FileNavigatorWidget;
        if (roots && fileModel) {
            const selectedNodes = fileModel.model.selectedFileStatNodes;
            const classpathURI = selectedNodes.length > 0 ? selectedNodes[0].uri.toString() : roots[0].uri;
            this.classpathContainer.updateClasspath(classpathURI);
        }
        this.resetState();
    }

    /**
     * Called when the dialog is closed and we reset the model
     */
    resetState(): void {
        for (const c of this.classpathNodes) {
            const model = c.widget.model as IClasspathModel;
            model.isDirty = false;
        }
    }

}
