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

import { TreeDecorator, TreeDecoration } from '@theia/core/lib/browser/tree/tree-decorator';
import { Tree, WidgetManager, TreeNode, LabelProvider } from '@theia/core/lib/browser';
import { Event, Emitter } from '@theia/core/lib/common/event';
import { injectable, inject } from 'inversify';
import { ClasspathContainer, ClasspathEntry, ClasspathEntryKind } from './classpath-container';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { JavaUtils } from '../java-utils';

@injectable()
export class ClasspathDecorator implements TreeDecorator {
    
    id: string = "classpath-decorator";
    
    protected readonly emitter: Emitter<(tree: Tree) => Map<string, TreeDecoration.Data>>;
    currentlyDecorated: Set<TreeNode> = new Set();

    constructor(@inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
                @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
                @inject(WidgetManager) protected readonly widgetManager: WidgetManager,
                @inject(LabelProvider) protected readonly labelProvider: LabelProvider) {
        this.emitter = new Emitter();
        this.classpathContainer.onClasspathModelChange(c => {
            this.fireDidChangeDecorations((tree: Tree) => this.collectDecorators(tree, c.classpathItems, c.uri));
        });
    }

    async decorations(tree: Tree): Promise<Map<string, TreeDecoration.Data>> {
        const roots = await this.workspaceService.roots;
        if (roots) {
            for (const root of roots) {
                const classpathItems = await this.classpathContainer.getClasspathItems(root.uri);
                return this.collectDecorators(tree, classpathItems, root.uri);
            }
        }
        return new Map();
    }

    protected collectDecorators(tree: Tree, classpathItems: ClasspathEntry[], uri: string): Map<string, TreeDecoration.Data> {
        let toDecorate = new Map<string, TreeDecoration.Data>();
        for (const classpathItem of classpathItems) {
            if (classpathItem.entryKind !== ClasspathEntryKind.SOURCE) {
                continue;
            }

            const multiRootURI = JavaUtils.getMultiRootReadyURI(uri, classpathItem.path);
            let navigatorTreeNode = tree.getNode(multiRootURI);
            if (navigatorTreeNode) {
                toDecorate.set(navigatorTreeNode.id, {
                    backgroundColor: "blue",
                    iconColor: "black"
                });
            }
        }
        return toDecorate;
    }
    
    get onDidChangeDecorations(): Event<(tree: Tree) => Map<string, TreeDecoration.Data>> {
        return this.emitter.event;
    }

    protected fireDidChangeDecorations(event: (tree: Tree) => Map<string, TreeDecoration.Data>): void {
        this.emitter.fire(event);
    }

}