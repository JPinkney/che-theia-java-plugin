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

import { TreeNode, SelectableTreeNode, ExpandableTreeNode, CompositeTreeNode } from '@theia/core/lib/browser';
import { SymbolKind } from '@theia/languages/lib/browser';

export interface UsagesResponse {
    searchedElement: string,
    elementKind: SymbolKind,
    searchResults: SearchResult[]
}

export interface UsagesNode extends SelectableTreeNode, ExpandableTreeNode {
    response: UsagesResponse
}

export interface ProjectNode extends SelectableTreeNode, ExpandableTreeNode {
    name: string,
    results: SearchResult[]
}

export interface LinearRange {
    offset: number,
    length: number
}

export interface SearchResult {
    kind: number,
    name: string,
    uri: string,
    children: Array<SearchResult>,
    matches: Array<LinearRange>
}

export interface PackageNode extends SelectableTreeNode, ExpandableTreeNode {
    pkg: SearchResult
}

export interface SnippetResult {
    snippet: string,
    linearRange: LinearRange,
    lineIndex: number,
    rangeInSnippet: LinearRange
}

export interface MatchNode extends SelectableTreeNode, ExpandableTreeNode {
    snippetResult: SnippetResult,
    uri: string
}

export interface ElementNode extends SelectableTreeNode, ExpandableTreeNode {
    result: SearchResult
}

export namespace MatchNode {
    export function is(node: TreeNode | undefined): node is MatchNode {
        return !!node && 'position' in node;
    }

    export function create(uri: string, snippetResult: SnippetResult, parent: TreeNode | undefined): MatchNode {
        const id = "test";
        return <MatchNode>{
            id,
            name,
            parent,
            uri,
            snippetResult,
            isLeaf: false,
            response: [],
            visible: true,
            children: [],
            expanded: false,
            selected: false,
        };
    }
}

export namespace ElementNode {
    export function is(node: TreeNode): node is ElementNode {
        return !!node && 'position' in node;
    }

    export function create(result: SearchResult, parent: Readonly<CompositeTreeNode>): ElementNode {
        const id = parent.id + "-" + result.name;
        return <ElementNode>{
            id,
            name,
            parent,
            result,
            isLeaf: false,
            response: [],
            visible: true,
            children: [],
            expanded: false,
            selected: false,
        };
    }

}
