/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { CompositeTreeNode, TreeNode } from '@theia/core/lib/browser/tree/tree';
import { EXTERNAL_LIBRARIES_CHILDREN } from '../../common/constants';
import { ExecuteCommandRequest } from "monaco-languageclient/lib";
import { ILanguageClient } from '@theia/languages/lib/browser';

export class JarFileNode implements CompositeTreeNode {
    children: ReadonlyArray<TreeNode>;
    id: string;
    name: string;
    icon?: string | undefined;
    description?: string | undefined;
    visible?: boolean | undefined;
    parent: Readonly<CompositeTreeNode> | undefined;
    nodePath: string;
    projectURI: string;

    constructor(id: string, name: string, nodepath: string, projectURI: string) {
        this.id = id;
        this.name = name;
        this.children = [];
        this.nodePath = nodepath;
        this.projectURI = projectURI;
    }

    public async resolveChildren(): Promise<Array<Node>> {
        return Promise.resolve(new Array<Node>());
    }

    public async getFileContent(jc: ILanguageClient) {
        return await jc.sendRequest(ExecuteCommandRequest.type, {
            command: EXTERNAL_LIBRARIES_CHILDREN,
            arguments: [
                this.projectURI,
                this.nodePath,
                this.id
            ]
        // tslint:disable-next-line:whitespace
        }).then(jars => Promise.resolve(jars));
    }

    public getName(): String {
        return this.name;
    }

    public isLeaf(): Boolean {
        return true;
    }

    public isClassFile(): Boolean {
        return this.getName().endsWith(".class");
    }

}
