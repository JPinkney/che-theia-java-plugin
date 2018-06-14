/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse export const License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

// project categories
export const JAVA_CATEGORY: string = "Java";
export const JAVA_ID: string = "java";
// project attribute names
export const LANGUAGE: string = "language";
export const LANGUAGE_VERSION: string = "languageVersion";
export const FRAMEWORK: string = "framework";
export const CONTAINS_JAVA_FILES: string = "containsJavaFiles";
export const SOURCE_FOLDER: string = "java.source.folder";
export const OUTPUT_FOLDER: string = "java.output.folder";

export const JAVAC: string = "javac";

// LS requests timeout constants
export const REQUEST_TIMEOUT: number = 10_000;
export const EFFECTIVE_POM_REQUEST_TIMEOUT: number = 30_000;
export const REIMPORT_MAVEN_PROJECTS_REQUEST_TIMEOUT: number = 60_000;

// JSON RPC methods
export const FILE_STRUCTURE: string = "java/filestructure";
export const EXTERNAL_LIBRARIES: string = "java/externalLibraries";
export const EXTERNAL_LIBRARIES_CHILDREN: string = "java/externalLibrariesChildren";
export const EXTERNAL_LIBRARY_CHILDREN: string = "java/libraryChildren";
export const EXTERNAL_LIBRARY_ENTRY: string = "java/libraryEntry";
export const CLASS_PATH_TREE: string = "java/classpathTree";
export const ORGANIZE_IMPORTS: string = "java/organizeImports";
export const EFFECTIVE_POM: string = "java/effective-pom";
export const REIMPORT_MAVEN_PROJECTS: string = "java/reimport-maven-projects";
export const IMPLEMENTERS: string = "java/implementers";
export const USAGES: string = "java/usages";

export const GET_JAVA_CORE_OPTIONS: string = "java/getJavaCoreOptions";
export const UPDATE_JAVA_CORE_OPTIONS: string = "java/updateJavaCoreOptions";
export const GET_PREFERENCES: string = "java/getPreferences";
export const UPDATE_PREFERENCES: string = "java/updatePreferences";
export const RECOMPUTE_POM_DIAGNOSTICS: string = "java/recomputePomDiagnostics";

export const PROGRESS_REPORT_METHOD: string = "java/progressReport";
export const PROGRESS_OUTPUT_UNSUBSCRIBE: string = "progressOutput/unsubscribe";
export const PROGRESS_OUTPUT_SUBSCRIBE: string = "progressOutput/subscribe";
