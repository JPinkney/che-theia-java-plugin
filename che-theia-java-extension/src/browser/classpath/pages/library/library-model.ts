import { ClasspathEntry, ClasspathEntryKind } from "../../classpath-container";
import { LabelProvider } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { injectable, inject } from "inversify";
import { ClasspathModelProps } from "../classpath-model";
import { ClasspathViewNode } from "../../node/classpath-node";

@injectable()
export class LibraryModel {

    isDirty = false;

    private currentClasspathItems: Map<string, ClasspathViewNode> = new Map();

    constructor(@inject(LabelProvider) protected readonly labelProvider: LabelProvider) {

    }

    classpathProps(): ClasspathModelProps {
        return {
            buttonText: "Add jar",
            dialogProps: {
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                title: "Add a jar",
                filters: {
                    "jars": ["jar"]
                }
            },
            title: "This is the library or whatever"
        }
    }

    addClasspathNodes(classpathEntry: ClasspathEntry[] | ClasspathEntry) {
        if (Array.isArray(classpathEntry)) { 
            for (const result of classpathEntry) {
                if (result.entryKind !== ClasspathEntryKind.CONTAINER && result.entryKind !== ClasspathEntryKind.LIBRARY) {
                    continue;
                }
    
                const classpathNode = this.createClasspathNodes(result);
                this.currentClasspathItems.set(result.path, classpathNode);
            }
        } else {
            this.isDirty = true;
            if (classpathEntry.entryKind === ClasspathEntryKind.CONTAINER || classpathEntry.entryKind === ClasspathEntryKind.LIBRARY) {
                const classpathNode = this.createClasspathNodes(classpathEntry);
                this.currentClasspathItems.set(classpathEntry.path, classpathNode);
            }
        }
    }

    createClasspathNodes(result: ClasspathEntry) {
        let childNodes = [];
        for (const child of result.children) {
            const childNode = {
                id: child.path,
                name: this.labelProvider.getName(new URI(child.path)) + " - " + child.path,
                icon: "java-jar-icon",
                classpathEntry: child
            } as ClasspathViewNode;
            childNodes.push(childNode);
        }

        const resultNode = {
            id: result.path,
            name: this.labelProvider.getName(new URI(result.path)),
            icon: "java-externalLibraries-icon",
            children: childNodes,
            parent: undefined,
            expanded: false,
            classpathEntry: result
        } as ClasspathViewNode;
        return resultNode;
    }

    removeClasspathNode(classpathViewNode: ClasspathViewNode): void {
        this.isDirty = true;
        this.currentClasspathItems.delete(classpathViewNode.classpathEntry.path);
    }

    get classpathItems(): ClasspathViewNode[] {
        return Array.from(this.currentClasspathItems.values());
    }

}