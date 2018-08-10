import { ReactRenderer } from "@theia/core/lib/browser/widgets/react-renderer";

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
import * as React from 'react';
import { ClasspathTreeWidget } from "../classpath-tree-widget";
import { inject } from "inversify";

export interface IClasspathPagePresenter {
    isDirty(): boolean; 
    storeChanges(): void;
    revertChanges(): void;
    clearData(): void;
}

export class ClasspathPagePresenter extends ReactRenderer implements IClasspathPagePresenter {

    title: string = "Testing";

    constructor(@inject(ClasspathTreeWidget) protected widget: ClasspathTreeWidget){
        super();
    }
    
    // button!: any; //This is going to have to be changed when we have some sort of implementation 

    isDirty(): boolean {
        throw new Error("Method not implemented.");
    }

    storeChanges(): void {
        throw new Error("Method not implemented.");
    }

    revertChanges(): void {
        throw new Error("Method not implemented.");
    }

    clearData(): void {
        throw new Error("Method not implemented.");
    }

    public doRender(): React.ReactNode {
        return (
            <div>
                <h4>{this.title}</h4>
            </div>
        );
    }
}