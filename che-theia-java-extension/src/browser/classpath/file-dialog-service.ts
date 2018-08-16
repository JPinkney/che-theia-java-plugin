/********************************************************************************
 * Copyright (C) 2018 Ericsson and others.
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
import URI from '@theia/core/lib/common/uri';
import { MaybeArray } from '@theia/core/lib/common';
import { LabelProvider } from '@theia/core/lib/browser';
import { FileSystem, FileStat } from '@theia/filesystem/lib/common';
import { FileStatNode, DirNode } from '@theia/filesystem/lib/browser';
import { FileDialogFactory, FileDialogProps } from '@theia/filesystem/lib/browser';

@injectable()
export class FileDialogService {
    @inject(FileSystem) protected readonly fileSystem!: FileSystem;
    @inject(FileDialogFactory) protected readonly fileDialogFactory!: FileDialogFactory;
    @inject(LabelProvider) protected readonly labelProvider!: LabelProvider;

    async show(props: FileDialogProps, folder: FileStat): Promise<MaybeArray<FileStatNode> | undefined> {
        const title = props.title || 'Open';
        if (folder) {
            console.log(folder.uri);
            const rootUri = new URI(folder.uri).parent;
            console.log(rootUri);
            const name = this.labelProvider.getName(rootUri);
            const [rootStat, label] = await Promise.all([
                this.fileSystem.getFileStat(rootUri.toString()),
                this.labelProvider.getIcon(folder)
            ]);
            if (rootStat) {
                const rootNode = DirNode.createRoot(rootStat, name, label);
                const dialog = this.fileDialogFactory(Object.assign(props, { title }));
                dialog.model.navigateTo(rootNode);
                return await dialog.open();
            }
        }
        return undefined;
    }
}