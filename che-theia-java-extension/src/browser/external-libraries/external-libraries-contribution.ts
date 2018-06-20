/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, postConstruct, inject } from "inversify";
import { AbstractViewContribution, Navigatable, Widget, SelectableTreeNode, OpenViewArguments } from '@theia/core/lib/browser';
import { ExternalLibrariesWidget, DebugVariableModel } from "./external-libraries-widget";
import { FileNavigatorPreferences } from "@theia/navigator/lib/browser/navigator-preferences";

export const CALL_HIERARCHY_TOGGLE_COMMAND_ID = 'callhierachy:toggle';
export const CALL_HIERARCHY_LABEL = 'Call hierarchy';

@injectable()
export class ExternalLibrariesContribution extends AbstractViewContribution<ExternalLibrariesWidget> {

    constructor(@inject(FileNavigatorPreferences) protected readonly fileNavigatorPreferences: FileNavigatorPreferences) {
        super({
            widgetId: "files3",
            widgetName: "External Libraries Widget 2",
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: "externallibraries:toggle",
            toggleKeybinding: 'ctrlcmd+shift+f6'
        });
    }

    async openView(args?: Partial<OpenViewArguments>): Promise<ExternalLibrariesWidget> {
        const widget = await super.openView(args);
        //widget.initializeModel();
        console.log("????");
        return widget;
    }


    @postConstruct()
    protected async init() {
        await this.fileNavigatorPreferences.ready;
        // const fileWidget = await this.widgetManager.getWidget("files") as FileNavigatorWidget;
        // const currModelRoot = fileWidget.model.root as CompositeTreeNode;
        // const externalLibraryRootNode = new LibrariesTreeNode("External Libraries", "External Libraries", "");
        // Object.assign(currModelRoot.children, currModelRoot.children.concat([externalLibraryRootNode]));
    }

    /**
     * Reveals and selects node in the file navigator to which given widget is related.
     * Does nothing if given widget undefined or doesn't have related resource.
     *
     * @param widget widget file resource of which should be revealed and selected
     */
    async selectWidgetFileNode(widget: Widget | undefined): Promise<void> {
        if (Navigatable.is(widget)) {
            const fileUri = widget.getTargetUri();
            if (fileUri) {
                const { model } = await this.widget;
                let model2 = model as DebugVariableModel;
                const node = await model2.revealFile(fileUri);
                if (SelectableTreeNode.is(node)) {
                    model.selectNode(node);
                }
            }
        }
    }
    
    protected onCurrentWidgetChangedHandler(): void {
        if (this.fileNavigatorPreferences['navigator.autoReveal']) {
            this.selectWidgetFileNode(this.shell.currentWidget);
        }
    }

}
