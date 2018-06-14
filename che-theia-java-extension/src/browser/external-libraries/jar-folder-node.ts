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
import { JarFileNode } from './jar-file-node';

export enum EntryType {
    FOLDER,
    PACKAGE,
    FILE,
    CLASS_FILE
}

export class JarFolderNode implements CompositeTreeNode {
    children: ReadonlyArray<TreeNode>;
    id: string;
    name: string;
    icon?: string | undefined;
    description?: string | undefined;
    visible?: boolean | undefined;
    parent: Readonly<CompositeTreeNode> | undefined;
    projectURI: string;

    constructor(id: string, name: string, projectURI: string) {
        this.id = id;
        this.name = name;
        this.children = [];
        this.projectURI = projectURI;
    }

    public async resolveChildren(jc: ILanguageClient): Promise<Array<TreeNode>> {
        return await jc.sendRequest(ExecuteCommandRequest.type, {
            command: EXTERNAL_LIBRARIES_CHILDREN,
            arguments: [
                this.projectURI,
                this.id
            ]
        // tslint:disable-next-line:whitespace
        }).then(jars => {
            // TODO: Fix
            const nodeArr: Array<TreeNode> = [];
            for (const jar of jars) {
                if (EntryType.FOLDER === jar["getEntryType"] || EntryType.PACKAGE === jar["getEntryType"]) {
                    nodeArr.push(new JarFolderNode(jar, "libId", "project"));
                } else if (EntryType.FILE === jar["getEntryType"] || EntryType.CLASS_FILE === jar["getEntryType"]){
                    nodeArr.push(new JarFileNode(jar, "libId", "project", "path"));
                }
            }
            return Promise.resolve(nodeArr);
        });
    }

    public getName(): String {
        return this.name;
    }

    public isLeaf(): Boolean {
        return false;
    }

}
