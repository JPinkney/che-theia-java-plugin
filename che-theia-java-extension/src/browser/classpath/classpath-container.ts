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
import { ClasspathEntry, ClasspathResolver } from './classpath-resolver';
import { ExecuteCommandRequest } from '@theia/languages/lib/browser';
import { GET_CLASS_PATH_TREE_COMMAND } from '../che-ls-jdt-commands';

@injectable()
export class ClasspathContainer  {

    private classpath = new Map<string, Promise<ClasspathEntry[]>>();

    constructor(@inject(LanguageClientProvider) protected readonly languageClientProvider: LanguageClientProvider,
                @inject(ClasspathResolver) protected readonly classPathResolver: ClasspathResolver) {
        this.classPathResolver.onClassPathChanged(classPathChange => this.classpath.set(classPathChange.path, Promise.resolve(classPathChange.children)));
    }

    /**
     * Returns list of classpath entries. If the classpath exists
     * for the project path return otherwise get the classpath from server
     */
    async getClassPathEntries(projectPath: string): Promise<ClasspathEntry[]> {
        if (this.classpath.has(projectPath)) {
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

}
