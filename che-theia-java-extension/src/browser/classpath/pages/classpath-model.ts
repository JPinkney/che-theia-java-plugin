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

import { ClasspathEntry } from "../classpath-container";
import { ClasspathViewNode } from "../node/classpath-node";
import { OpenFileDialogProps } from "../../../../../node_modules/@theia/filesystem/lib/browser";

export const IClasspathModel = Symbol('IClasspathModel');

export interface ClasspathModelProps {
    title: string;
    buttonText: string;
    dialogProps: OpenFileDialogProps
}

export interface IClasspathModel {
    classpathProps(): ClasspathModelProps;
    classpathItems: ClasspathViewNode[];
    addClasspathNodes(classpathItems: ClasspathEntry[] | ClasspathEntry): void;
    removeClasspathNode(path: string): void;
    isDirty: boolean;
}
