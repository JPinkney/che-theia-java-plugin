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
import { Tree, WidgetManager } from '@theia/core/lib/browser';
import { Event, Emitter } from '@theia/core/lib/common/event';
import { injectable, inject } from 'inversify';
import { ClasspathContainer, ClasspathEntry, ClasspathEntryKind } from './classpath-container';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileNavigatorWidget, FILE_NAVIGATOR_ID } from '@theia/navigator/lib/browser/navigator-widget';
import { JavaUtils } from '../java-utils';

@injectable()
export class ClasspathDecorator implements TreeDecorator {
    
    id: string = "classpath-decorator";
    
    protected readonly emitter: Emitter<(tree: Tree) => Map<string, TreeDecoration.Data>>;

    constructor(@inject(ClasspathContainer) protected readonly classpathContainer: ClasspathContainer,
                @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
                @inject(WidgetManager) protected readonly widgetManager: WidgetManager) {
        this.emitter = new Emitter();
        this.classpathContainer.onClasspathModelChange(c => {
            this.collectDecorators(c.classpathItems, c.uri);
            this.fireDidChangeDecorations((tree: Tree) => new Map());
        });
    }

    async decorations(tree: Tree): Promise<Map<string, TreeDecoration.Data>> {
        const roots = await this.workspaceService.roots;
        if (roots) {
            const classpathItems = await this.classpathContainer.getClasspathItems(roots[0].uri);
            this.collectDecorators(classpathItems, roots[0].uri);
        }
        return new Map();
    }

    protected async collectDecorators(classpathItems: ClasspathEntry[], uri: string): Promise<void> {
        const fileWidget = await this.widgetManager.tryGetWidget(FILE_NAVIGATOR_ID) as FileNavigatorWidget;
        if (fileWidget) {
            const tree = fileWidget.model;
            for (const classpathItem of classpathItems) {
                if (classpathItem.entryKind !== ClasspathEntryKind.SOURCE) {
                    continue;
                }
    
                const multiRootURI = JavaUtils.getMultiRootReadyURI(uri, classpathItem.path);
                let navigatorTreeNode = tree.getNode(multiRootURI);
                if (navigatorTreeNode) {
                    // if (navigatorTreeNode.icon && navigatorTreeNode.icon.includes("java-source-folder-icon")) {
                    //     Object.assign(navigatorTreeNode, {
                    //         "icon": "fa fa-folder file-icon"
                    //     });          
                    // } else {
                        Object.assign(navigatorTreeNode, {
                            "icon": "java-source-folder-icon java-libraries-icon"
                        });
                    // }      
                }
            }
        }
    }
    
    get onDidChangeDecorations(): Event<(tree: Tree) => Map<string, TreeDecoration.Data>> {
        return this.emitter.event;
    }

    protected fireDidChangeDecorations(event: (tree: Tree) => Map<string, TreeDecoration.Data>): void {
        this.emitter.fire(event);
    }

}