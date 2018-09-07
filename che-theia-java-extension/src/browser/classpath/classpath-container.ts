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

import { injectable, inject } from 'inversify';
import { LanguageClientProvider } from '@theia/languages/lib/browser/language-client-provider';
import { ExecuteCommandRequest } from '@theia/languages/lib/browser';
import { UPDATE_PROJECT_CLASSPATH, GET_CLASS_PATH_TREE_COMMAND } from '../che-ls-jdt-commands';
import { Event, Emitter } from '@theia/core/lib/common';

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

export interface ClasspathChangeNotification {
    classpathItems: ClasspathEntry[];
    uri: string;
}

@injectable()
export class ClasspathContainer  {

    private static WORKSPACE_PATH = "/projects";

    private classpath = new Map<string, Promise<ClasspathEntry[]>>();

    private libs = new Set<string>();
    private containers = new Set<ClasspathEntry>();
    private sources = new Set<string>();
    private projects = new Set<string>();

    readonly onClasspathModelChangeEmitter: Emitter<ClasspathChangeNotification> = new Emitter();
    public onClasspathModelChange: Event<ClasspathChangeNotification> = this.onClasspathModelChangeEmitter.event;

    constructor(@inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider) {
    }

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
                    this.projects.add(ClasspathContainer.WORKSPACE_PATH + entry.path);
                    break;
                default:
            }
        }
    }

    clearClasspathEntries() {
        this.libs.clear();
        this.containers.clear();
        this.sources.clear();
        this.projects.clear();
    }

    removeClasspathEntry(entry: ClasspathEntry): void {
        switch (entry.entryKind) {
            case ClasspathEntryKind.LIBRARY:
                this.libs.delete(entry.path);
                break;
            case ClasspathEntryKind.CONTAINER:
                this.containers.delete(entry);
                break;
            case ClasspathEntryKind.SOURCE:
                this.sources.delete(entry.path);
                break;
            case ClasspathEntryKind.PROJECT:
                this.projects.delete(ClasspathContainer.WORKSPACE_PATH + entry.path);
                break;
        }
    }
    
    async updateClasspath(projectURI: string) {
        const classpathEntries: ClasspathEntry[] = [];

        this.libs.forEach(path => classpathEntries.push({
            path,
            entryKind: ClasspathEntryKind.LIBRARY
        } as ClasspathEntry));

        this.containers.forEach(entry => classpathEntries.push(entry));

        this.sources.forEach(path => classpathEntries.push({
            path,
            entryKind: ClasspathEntryKind.SOURCE
        } as ClasspathEntry));

        this.projects.forEach(path => classpathEntries.push({
            path,
            entryKind: ClasspathEntryKind.PROJECT
        } as ClasspathEntry));
        
        this.classpath.set(projectURI, Promise.resolve(classpathEntries));
        //Classpath updater set raw classpath
        this.update(projectURI, classpathEntries);
        this.onClasspathModelChangeEmitter.fire({
            uri: projectURI,
            classpathItems: classpathEntries
        });
    }

    private async update(projectURI: string, classpathEntries: ClasspathEntry[]) {
        console.log("Inside update");
        console.log(projectURI);
        console.log(classpathEntries);
        const javaClient = await this.languageClientProvider.getLanguageClient("java");
        if (javaClient) {
            console.log("Sending request");
            const result = await javaClient.sendRequest(ExecuteCommandRequest.type, {
                command: UPDATE_PROJECT_CLASSPATH,
                arguments: [
                    {
                        uri: projectURI,
                        entries: classpathEntries
                    }
                ]
            });
            console.log(result);
            console.log("Finished request");
        }
    }
    
    /**
     * Returns list of classpath entries. If the classpath exists
     * for the project path return otherwise get the classpath from server
     */
    async getClassPathEntries(projectPath: string): Promise<ClasspathEntry[]> {
        if (this.classpath.has(projectPath)) {
            console.log("getting from classpath");
            console.log(this.classpath.get(projectPath));
            return this.classpath.get(projectPath) || [];
        } else {
            const javaClient = await this.languageClientProvider.getLanguageClient("java");
            if (javaClient) {
                const result = await javaClient.sendRequest(ExecuteCommandRequest.type, {
                    command: GET_CLASS_PATH_TREE_COMMAND,
                    arguments: [
                        projectPath
                    ]
                });
                this.classpath.set(projectPath, result);
                return result;
            } 
            return [];
        }
    }

    getClasspathItems(projectPath: string) {
        return this.classpath.get(projectPath) || [];
    }

}
