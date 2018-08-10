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

import { injectable, inject, postConstruct } from "inversify";
import { AbstractDialog, Message, Widget } from "@theia/core/lib/browser";
import { Disposable } from "@theia/core";
import { BuildPathTreeWidget } from "./build-path-widget";
import { ClasspathTreeWidget } from "./classpath-tree-widget";

@injectable()
export class DialogProps {
    readonly title: string = "";
}

@injectable()
export abstract class ClassPathDialog extends AbstractDialog<void> {
    
    private leftPanel: HTMLElement;
    private rightPanel: HTMLElement;

    constructor(@inject(DialogProps) protected readonly props: DialogProps,
                @inject(BuildPathTreeWidget) protected readonly buildPathTreeWidget: BuildPathTreeWidget,
                @inject(ClasspathTreeWidget) protected readonly classPathTreeWidget: ClasspathTreeWidget) {
        super(props);

        if (this.contentNode.parentElement) {
            this.contentNode.parentElement.classList.add('classpath-modal');
        }

        this.leftPanel = document.createElement('div');
        this.leftPanel.classList.add('classpath-panel');

        this.rightPanel = document.createElement('div');
        this.rightPanel.classList.add('classpath-panel');

        this.contentNode.classList.remove('dialogContent');
        this.contentNode.classList.add('classpath-content');

        this.contentNode.appendChild(this.leftPanel);
        this.contentNode.appendChild(this.rightPanel);
    }

    @postConstruct()
    protected init() {
        this.toDispose.push(this.buildPathTreeWidget);
        this.toDispose.push(this.classPathTreeWidget);
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        Widget.attach(this.buildPathTreeWidget, this.leftPanel);
        Widget.attach(this.classPathTreeWidget, this.rightPanel);
        this.toDisposeOnDetach.push(Disposable.create(() => {
            Widget.detach(this.buildPathTreeWidget);
            Widget.detach(this.classPathTreeWidget);
        }));
    }

    protected onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        this.buildPathTreeWidget.update();
        this.classPathTreeWidget.update();
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.buildPathTreeWidget.createBuildPathTree();
        this.classPathTreeWidget.createClassPathTree();
    }

}
