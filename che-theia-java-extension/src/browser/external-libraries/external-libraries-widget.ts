/*
 * Copyright (C) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import {
    TreeImpl,
    ContextMenuRenderer,
    CompositeTreeNode,
    SelectableTreeNode,
    ExpandableTreeNode,
    TreeNode,
    TreeProps,
    LabelProvider,
    ApplicationShell
} from "@theia/core/lib/browser";
import { h } from '@phosphor/virtualdom';
import { injectable, inject, postConstruct } from "inversify";
import { CommandService, SelectionService } from "@theia/core";
import URI from "@theia/core/lib/common/uri";
import { FileNavigatorModel, FileNavigatorWidget } from "@theia/navigator/lib/browser";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { FileNavigatorSearch } from "@theia/navigator/lib/browser/navigator-search";
import { SearchBoxFactory } from "@theia/navigator/lib/browser/search-box";
import { FileSystem } from "@theia/filesystem/lib/common";

/**
 * Is it used to display variables.
 */
@injectable()
export class ExternalLibrariesWidget extends FileNavigatorWidget {
    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(FileNavigatorModel) readonly model: FileNavigatorModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer,
        @inject(CommandService) protected readonly commandService: CommandService,
        @inject(SelectionService) protected readonly selectionService: SelectionService,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(LabelProvider) protected readonly labelProvider: LabelProvider,
        @inject(FileNavigatorSearch) protected readonly navigatorSearch: FileNavigatorSearch,
        @inject(SearchBoxFactory) protected readonly searchBoxFactory: SearchBoxFactory,
        @inject(ApplicationShell) protected readonly shell: ApplicationShell,
        @inject(FileSystem) protected readonly fileSystem: FileSystem) {
        super(props, model, contextMenuRenderer, commandService, selectionService, workspaceService, labelProvider, navigatorSearch, searchBoxFactory, shell, fileSystem);

        this.id = `debug-variables`;
        this.title.label = 'Variables';
        this.addClass(Styles.VARIABLES_CONTAINER);
    }

    protected render(): h.Child {
        const header = h.div({ className: "theia-header" }, "Variables");
        return h.div(header, super.render());
    }

}

@injectable()
export class DebugVariableModel extends FileNavigatorModel {
    constructor() {
        super();
    }

    @postConstruct()
    protected init() {
        super.init();
    }

     /**
     * Reveals node in the navigator by given file uri.
     *
     * @param targetFileUri uri to file which should be revealed in the navigator
     * @returns file tree node if the file with given uri was revealed, undefined otherwise
     */
    async revealFile(targetFileUri: URI): Promise<TreeNode | undefined> {
        const navigatorNodeId = targetFileUri.toString();
        let node = this.getNode(navigatorNodeId);

        // success stop condition
        // we have to reach workspace root because expanded node could be inside collapsed one
        if (this.root === node) {
            if (ExpandableTreeNode.is(node)) {
                if (!node.expanded) {
                    await this.expandNode(node);
                }
                return node;
            }
            // shouldn't happen, root node is always directory, i.e. expandable
            return undefined;
        }

        // fail stop condition
        if (targetFileUri.path.isRoot) {
            // file system root is reached but workspace root wasn't found, it means that
            // given uri is not in workspace root folder or points to not existing file.
            return undefined;
        }

        if (await this.revealFile(targetFileUri.parent)) {
            if (node === undefined) {
                // get node if it wasn't mounted into navigator tree before expansion
                node = this.getNode(navigatorNodeId);
            }
            if (ExpandableTreeNode.is(node) && !node.expanded) {
                await this.expandNode(node);
            }
            return node;
        }
        return undefined;
    }
    
}

@injectable()
export class DebugVariablesTree extends TreeImpl {
    constructor() {
        super();
    }

    protected resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {
        if (LibraryNode.is(parent)) {
            return Promise.resolve([]);
        }

        if (JarNode.is(parent)) {
            return Promise.resolve([]);
        }

        if (JarFolderNode.is(parent)) {
            return Promise.resolve([]);
        }

        if (JarFileNode.is(parent)) {
            return Promise.resolve([]);
        }

        return super.resolveChildren(parent);
    }
}

export interface LibraryNode extends SelectableTreeNode, ExpandableTreeNode, CompositeTreeNode {

}

export interface JarNode extends SelectableTreeNode, ExpandableTreeNode, CompositeTreeNode {

}

export interface JarFolderNode extends SelectableTreeNode, ExpandableTreeNode, CompositeTreeNode {

}

export interface JarFileNode extends TreeNode {

}

namespace LibraryNode {
    export function is(node: TreeNode | undefined): node is LibraryNode {
        return !!node; // && 'extVariable' in node;
    }

    export function create(nodeID: string, parent?: TreeNode): LibraryNode {
        const id = createId(nodeID, "", "");
        return <LibraryNode>{
            id,
            name,
            parent,
            visible: true,
            expanded: false,
            selected: false,
            children: []
        };
    }

    export function getId(sessionId: string, name: string, parentVariablesReference: number): string {
        return createId(sessionId, name, parentVariablesReference);
    }
}

namespace JarNode {
    export function is(node: TreeNode | undefined): node is JarNode {
        return !!node; //&& 'scope' in node;
    }

    export function create(sessionId: string, parent?: TreeNode): JarNode {
        const id = getId(sessionId, "");
        return <JarNode>{
            id,
            name,
            parent,
            visible: true,
            expanded: false,
            selected: false,
            children: []
        };
    }

    export function getId(sessionId: string, name: string): string {
        return createId(sessionId, name);
    }
}

namespace JarFolderNode {
    export function is(node: TreeNode | undefined): node is JarFolderNode {
        return !!node; //&& 'frameId' in node;
    }

    export function create(sessionId: string, frameId: number, parent?: TreeNode): JarFolderNode {
        const id = createId(sessionId, `frame-${frameId}`);
        return <JarFolderNode>{
            id,
            frameId,
            parent,
            name: 'Debug variable',
            visible: false,
            expanded: true,
            selected: false,
            children: []
        };
    }

    export function getId(sessionId: string, frameId: number): string {
        return createId(sessionId, `frame-${frameId}`);
    }
}

namespace JarFileNode {
    export function is(node: TreeNode | undefined): node is JarFileNode {
        return !!node; //&& 'frameId' in node;
    }

    export function create(sessionId: string, frameId: number, parent?: TreeNode): JarFileNode {
        const id = createId(sessionId, `frame-${frameId}`);
        return <JarFileNode>{
            id,
            frameId,
            parent,
            name: 'Debug variable',
            visible: false,
            expanded: true,
            selected: false,
            children: []
        };
    }

    export function getId(sessionId: string, frameId: number): string {
        return createId(sessionId, `frame-${frameId}`);
    }
}

function createId(sessionId: string, itemId: string | number, parentId?: string | number): string {
    return `debug-variables-${sessionId}` + (parentId && `-${parentId}`) + `-${itemId}`;
}

namespace Styles {
    export const VARIABLES_CONTAINER = 'theia-debug-variables-container';
}