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
import { RightViewRenderer } from "./pages/right-view";

@injectable()
export class DialogProps {
    readonly title: string = "";
}

@injectable()
export abstract class ClassPathDialog extends AbstractDialog<void> {
    
    private leftPanel: HTMLElement;
    rightPanel: HTMLElement;

    constructor(@inject(DialogProps) protected readonly props: DialogProps,
                @inject(BuildPathTreeWidget) protected readonly buildPathTreeWidget: BuildPathTreeWidget) {
        super(props);

        if (this.contentNode.parentElement) {
            this.contentNode.parentElement.classList.add('classpath-modal');
        }

        this.leftPanel = document.createElement('div');
        this.leftPanel.classList.add('classpath-panel');
        this.leftPanel.classList.add('classpath-panel-left');

        this.rightPanel = document.createElement('div');
        this.rightPanel.classList.add('classpath-panel');
        this.rightPanel.classList.add('classpath-panel-right');

        this.contentNode.classList.remove('dialogContent');
        this.contentNode.classList.add('classpath-content');

        const c = new RightViewRenderer({dialogTitle: "blah", title: "blah2", buttonText: "woot", openDialogFilter: [".jar"]});
        c.render();
        const blah = c.host;
        this.rightPanel.appendChild(blah);

        this.contentNode.appendChild(this.leftPanel);
        this.contentNode.appendChild(this.rightPanel);

        // const button = this.createButton('done');
        // button.onclick = () => this.classPathTreeWidget.save();
        // this.controlPanel.appendChild(button);

        // this.closeCrossNode.onclick = () => {
        //     if (this.classPathTreeWidget.isDirty) {
        //         //Confirm dialog
        //     } else {
        //         //Just close. I guess just don't do anything?
        //         this.close();
        //     }
        // };
    }

    @postConstruct()
    protected init() {
        this.toDispose.push(this.buildPathTreeWidget);
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        Widget.attach(this.buildPathTreeWidget, this.leftPanel);
        this.toDisposeOnDetach.push(Disposable.create(() => {
            Widget.detach(this.buildPathTreeWidget);
        }));
    }

    protected onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        this.buildPathTreeWidget.update();
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.buildPathTreeWidget.createBuildPathTree();
    }

}
