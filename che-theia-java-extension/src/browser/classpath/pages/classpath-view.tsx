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

import { ReactRenderer } from "@theia/core/lib/browser/widgets/react-renderer";
import * as React from 'react';
import { inject } from "../../../../../node_modules/inversify";
import { ClasspathRightModel } from "./classpath-right-model";

export interface ClasspathListNode {
    id: string,
    name: string
}

export class ClasspathListRenderer extends ReactRenderer {

    @inject(ClasspathRightModel) protected readonly classpathRightModel!: ClasspathRightModel;

    constructor(
        host?: HTMLElement
    ) {
        super(host);
    }

    protected doRender(): React.ReactNode {
        const classpathItems = [].map(value => this.renderClasspathItem(value));
        return <div>{...classpathItems}</div>;
    }

    protected renderClasspathItem(classpathListNode: ClasspathListNode): React.ReactNode {
        return <li key={classpathListNode.id}>{classpathListNode.name}</li>;
    }

}
