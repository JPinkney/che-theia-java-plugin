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

import { injectable } from "inversify";
import { Emitter, Event } from "@theia/core";
import { ClasspathListNode } from "./right-view";
import { ClasspathNode } from "../node/classpath-node";

export interface ClasspathModelProps {
    title: string;
    buttonText: string;
    filter: string[];
    dialogTitle: string;
}

/**
 * This is the model of classpath items that the build path widget manipulates to show class path items on the right
 */
@injectable()
export class ClasspathRightModel {
  
    protected readonly onClasspathModelChangedEmitter: Emitter<void> = new Emitter();
    public onClasspathModelChanged: Event<void> = this.onClasspathModelChangedEmitter.event;

    private classpathItemList: Map<string, ClasspathListNode[]> = new Map<string, ClasspathListNode[]>();
    
    selectedNode: ClasspathNode | undefined;

    isDirty = false;

    private classpathModelProp: ClasspathModelProps = {
        buttonText: "",
        dialogTitle: "",
        filter: [],
        title: ""   
    };

    setClasspathItems(id: string, classpathItems: any[]){
        this.isDirty = true;
        this.classpathItemList.set(id, classpathItems);
        this.onClasspathModelChangedEmitter.fire(undefined);
    }

    set classpathItems(classpathItems: ClasspathListNode[]){
        if (this.selectedNode) {
            this.isDirty = true;
            this.classpathItemList.set(this.selectedNode.id, classpathItems);
            this.onClasspathModelChangedEmitter.fire(undefined);
        }
    }

    getClasspathItems(id: string): ClasspathListNode[] {
        return this.classpathItemList.get(id) || [];
    }

    get classpathItems(): ClasspathListNode[] {
        return this.selectedNode ? this.classpathItemList.get(this.selectedNode.id) || [] : [];
    }

    set classpathModelProps(classpathModelProps: ClasspathModelProps) {
        this.classpathModelProp = classpathModelProps;
        this.onClasspathModelChangedEmitter.fire(undefined);
    }

    get classpathModelProps() {
        return this.classpathModelProp;
    }

    save() {
        // Save to jdt.ls
        
        // Update the navigator tree icons
    }

}
