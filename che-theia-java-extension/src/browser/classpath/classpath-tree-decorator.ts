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
import { Tree } from '@theia/core/lib/browser';
import { Event, Emitter } from '@theia/core/lib/common/event';
import { injectable, inject } from 'inversify';
import { ClasspathContainer, ClasspathEntry, ClasspathEntryKind } from './classpath-container';
import { WorkspaceService } from '../../../../node_modules/@theia/workspace/lib/browser';

@injectable()
export class ClasspathDecorator implements TreeDecorator {
    
    id: string = "classpath-decorator";
    
    protected readonly emitter: Emitter<(tree: Tree) => Map<string, TreeDecoration.Data>>;

    constructor(@inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
                @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService) {
        this.emitter = new Emitter();
        this.classpathContainer.onClasspathModelChange((c) => {
            this.fireDidChangeDecorations((tree: Tree) => this.collectDecorators(tree, c.classpathItems));
        });
    }

    async decorations(tree: Tree): Promise<Map<string, TreeDecoration.Data>> {
        const root = await this.workspaceService.root;
        if (root) {
            const classpathItems = await this.classpathContainer.getClasspathItems(root.uri);
            return this.collectDecorators(tree, classpathItems);
        }
        return new Map();
    }

    protected collectDecorators(tree: Tree, classpathItems: ClasspathEntry[]): Map<string, TreeDecoration.Data> {
        let classpathDecoratorMap = new Map<string, TreeDecoration.Data>();
        for (const classpathItem of classpathItems) {
            if (classpathItem.entryKind !== ClasspathEntryKind.SOURCE) {
                continue;
            }

            let navigatorTreeNode = tree.getNode(classpathItem.path);
            if (navigatorTreeNode) {
                classpathDecoratorMap.set(navigatorTreeNode.id, {
                    iconColor: "yellow",
                    priority: 10
                } as TreeDecoration.Data);
            }
        }
        return classpathDecoratorMap;
    }

    get onDidChangeDecorations(): Event<(tree: Tree) => Map<string, TreeDecoration.Data>> {
        return this.emitter.event;
    }

    protected fireDidChangeDecorations(event: (tree: Tree) => Map<string, TreeDecoration.Data>): void {
        this.emitter.fire(event);
    }

}
