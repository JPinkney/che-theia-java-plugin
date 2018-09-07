import { ClasspathEntry, ClasspathEntryKind } from "../../classpath-container";
import { LabelProvider } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { injectable, inject } from "inversify";
import { ClasspathModelProps, IClasspathModel } from "../classpath-model";
import { ClasspathViewNode } from "../../node/classpath-node";

 @injectable()
 export class SourceModel implements IClasspathModel {

    isDirty = false;

    private currentClasspathItems: Map<string, ClasspathViewNode> = new Map();

    constructor(@inject(LabelProvider) protected readonly labelProvider: LabelProvider) {
        
    }

    classpathProps(): ClasspathModelProps {
        return {
            buttonText: "Add folder",
            title: "This is the library or whatever",
            dialogProps: {
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                title: "Add a folder"
            }
        }
    }
    
    addClasspathNodes(classpathEntry: ClasspathEntry[] | ClasspathEntry) {
        if (Array.isArray(classpathEntry)) {
            for (const result of classpathEntry) {
                
                if (result.entryKind !== ClasspathEntryKind.SOURCE) {
                    continue;
                }
    
                const classpathViewNode = this.createClasspathNode(result);
                this.currentClasspathItems.set(result.path, classpathViewNode);
            }
        } else {
            this.isDirty = true;
            if (classpathEntry.entryKind === ClasspathEntryKind.SOURCE) {
                const classpathViewNode = this.createClasspathNode(classpathEntry);
                this.currentClasspathItems.set(classpathEntry.path, classpathViewNode);
            }    
        }
    }

    createClasspathNode(result: ClasspathEntry) {
        const resultNode = {
            id: result.path,
            name: this.labelProvider.getName(new URI(result.path)),
            icon: "java-source-folder-icon",
            parent: undefined,
            classpathEntry: result
        } as ClasspathViewNode;
        
        return resultNode;
    }

    removeClasspathNode(path: string): void {
        this.isDirty = true;
        this.currentClasspathItems.delete(path);
    }

    get classpathItems(): ClasspathViewNode[] {
        return Array.from(this.currentClasspathItems.values());
    }

 }