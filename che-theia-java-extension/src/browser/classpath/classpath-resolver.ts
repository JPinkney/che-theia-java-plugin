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

import { injectable } from 'inversify';
import { Emitter } from '@theia/core';

export interface ClasspathEntry {
    entryKind: ClasspathEntryKind,
    path: string,
    children: ClasspathEntry[]
}

export enum ClasspathEntryKind {
    LIBRARY = 1,
    PROJECT = 2,
    SOURCE = 3,
    VARIABLE = 4,
    CONTAINER = 5
}

@injectable()
export class ClasspathResolver  {

    private static WORKSPACE_PATH = "/projects";

    private libs = new Set();
    private containers = new Set();
    private sources = new Set();
    private projects = new Set();

    private readonly classPathChanged = new Emitter<ClasspathEntry>();
    readonly onClassPathChanged = this.classPathChanged.event;

    /**
     * Reads and parses classpath entries
     */
    resolveClasspathEntries(entries: ClasspathEntry[]): void {

        for (const entry of entries) {
            switch (entry.entryKind) {
                case ClasspathEntryKind.LIBRARY:
                    this.libs.add(entry.path);
                    break;
                case ClasspathEntryKind.CONTAINER:
                    this.containers.add(entry);
                    break;
                case ClasspathEntryKind.SOURCE:
                    this.sources.add(entry.path);
                    break;
                case ClasspathEntryKind.PROJECT:
                    this.projects.add(ClasspathResolver.WORKSPACE_PATH + entry.path);
                    break;
                default:
            }
        }
    }
    
    /**
     * Concatenates classpath entries and update classpath file
     * TODO
     */
    updateClasspath() {
        
    }

}
