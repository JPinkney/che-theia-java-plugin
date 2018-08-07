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

import { injectable, inject } from "inversify";
import { AbstractDialog } from "@theia/core/lib/browser";

@injectable()
export class DialogProps {
    readonly title: string = "";
}

@injectable()
export abstract class ClassPathDialog extends AbstractDialog<void> {
    constructor(@inject(DialogProps) protected readonly props: DialogProps) {
        super(props);
    }

    /**
     * On after attach we can append the widgets
     */

    /**
     * We are going to need
     * 1. Left side of the panel
     *  - Java Build Path
     *      - Libraries
     *      - Source
     * 2. Right side of the panel
     *  - Title
     *  - Tree view
     *  - Button
     */
}
