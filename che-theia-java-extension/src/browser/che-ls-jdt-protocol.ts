/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { RequestType } from 'vscode-jsonrpc';

export interface ExternalLibrariesRequestParams {
    
}

export interface ExternalLibrariesParams {

	/**
	 * The paramaters
	 */
	parameters: Array<Object>;
	/**
	 * Arguments that the command should be invoked with.
	 */
	pm: any;
}

export namespace ExternalLibrariesRequest {
    export const type = new RequestType<ExternalLibrariesParams, Object, void, void>('che.jdt.ls.extension.externalLibraries');
}
