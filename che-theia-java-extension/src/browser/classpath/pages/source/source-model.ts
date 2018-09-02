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
    
    addClasspathNodes(classpathEntry: ClasspathEntry[]) {
        this.isDirty = true;
        for (const result of classpathEntry) {
            
            if (result.entryKind !== ClasspathEntryKind.SOURCE) {
                continue;
            }

            const resultNode = {
                id: result.path,
                name: this.labelProvider.getName(new URI(result.path)),
                icon: "java-source-folder-icon",
                parent: undefined,
                classpathEntry: result
            } as ClasspathViewNode;
            this.currentClasspathItems.set(result.path, resultNode);
        }
    }

    removeClasspathNode(classpathViewNode: ClasspathViewNode): void {
        this.isDirty = true;
        this.currentClasspathItems.delete(classpathViewNode.classpathEntry.path);
    }

    get classpathItems(): ClasspathViewNode[] {
        return Array.from(this.currentClasspathItems.values());
    }

 }