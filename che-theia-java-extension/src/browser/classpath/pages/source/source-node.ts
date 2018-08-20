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

import { CompositeTreeNode, LabelProvider } from "@theia/core/lib/browser";
import { ClasspathNode } from "../../node/classpath-node";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { ClasspathContainer } from "../../classpath-container";
import { ClasspathEntryKind } from "../../classpath-resolver";
import { ClasspathRightModel, ClasspathModelProps } from "../classpath-right-model";
import { ClasspathListNode } from "../right-view";
import URI from "@theia/core/lib/common/uri";

export class SourceNode implements ClasspathNode {
    
    static SourceTitle = "This is the Source stuff or whatever";

    id: string;
    name: string;
    parent: Readonly<CompositeTreeNode>;
    selected: boolean;
    workspaceService: WorkspaceService;
    classpathContainer: ClasspathContainer;
    classpathModel: ClasspathRightModel;
    labelProvider: LabelProvider;
    filter = [];
    
    constructor(parent: Readonly<CompositeTreeNode>, workspaceService: WorkspaceService, classpathContainer: ClasspathContainer, classpathModel: ClasspathRightModel, labelProvider: LabelProvider) {
        this.parent = parent;
        this.name = "Source";
        this.id = this.name;
        this.selected = false;
        this.workspaceService = workspaceService;
        this.classpathContainer = classpathContainer;
        this.classpathModel = classpathModel;
        this.labelProvider = labelProvider;
    }

    private classpathProps(): ClasspathModelProps {
        return {
            buttonText: "Add folder",
            dialogTitle: "Add a folder",
            filter: this.filter,
            title: "This is the library or whatever"
        }
    }

    async onSelect(): Promise<void> {
        
        const root = await this.workspaceService.root;
        if (root) {

            const results = await this.classpathContainer.getClassPathEntries(root.uri);

            let resultNodes: ClasspathListNode[] = [];
            for (const result of results) {
                
                if (result.entryKind !== ClasspathEntryKind.SOURCE) {
                    continue;
                }

                const resultNode = {
                    id: result.path,
                    name: this.labelProvider.getName(new URI(result.path))
                } as ClasspathListNode;
                resultNodes.push(resultNode);
            }

            this.classpathModel.selectedNode = this;
            this.classpathModel.classpathItems = resultNodes;
            this.classpathModel.classpathModelProps = this.classpathProps();
        }
    }

}