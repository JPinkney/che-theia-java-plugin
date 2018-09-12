import { ClasspathEntry, ClasspathEntryKind } from "../../classpath-container";
import { LabelProvider, TreeModelImpl, CompositeTreeNode } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { injectable, inject } from "inversify";
import { IClasspathModel } from "../classpath-model";
import { ClasspathViewNode } from "../../nodes/classpath-node";

@injectable()
export class LibraryModel extends TreeModelImpl implements IClasspathModel {

    isDirty = false;

    private currentClasspathItems: Map<string, ClasspathViewNode> = new Map();

    constructor(@inject(LabelProvider) protected readonly labelProvider: LabelProvider) {
        super();
    }

    addClasspathNodes(classpathEntry: ClasspathEntry[] | ClasspathEntry) {
        if (Array.isArray(classpathEntry)) { 
            for (const result of classpathEntry) {
                if (result.entryKind !== ClasspathEntryKind.CONTAINER && result.entryKind !== ClasspathEntryKind.LIBRARY) {
                    continue;
                }
    
                const classpathNode = this.createClasspathNodes(result, false);
                this.currentClasspathItems.set(result.path, classpathNode);
            }
        } else {
            this.isDirty = true;
            if (classpathEntry.entryKind === ClasspathEntryKind.CONTAINER || classpathEntry.entryKind === ClasspathEntryKind.LIBRARY) {
                const classpathNode = this.createClasspathNodes(classpathEntry, true);
                this.currentClasspathItems.set(classpathEntry.path, classpathNode);
            }
        }
        this.updateTree();
    }

    private createClasspathNodes(result: ClasspathEntry, isRemoveable: boolean) {
        let childNodes = [];
        if (result.children) {
            for (const child of result.children) {
                const childNode = {
                    id: child.path,
                    name: this.labelProvider.getName(new URI(child.path)) + " - " + child.path,
                    icon: "java-jar-icon",
                    classpathEntry: child,
                    isRemoveable: false
                } as ClasspathViewNode;
                childNodes.push(childNode);
            }
        }
    
        if (childNodes.length > 0) {
            const resultNode = {
                id: result.path,
                name: this.labelProvider.getName(new URI(result.path)),
                icon: "java-externalLibraries-icon",
                children: childNodes,
                parent: undefined,
                expanded: false,
                classpathEntry: result,
                isRemoveable: isRemoveable
            } as ClasspathViewNode;
            return resultNode;
        } else {
            const resultNode = {
                id: result.path,
                name: this.labelProvider.getName(new URI(result.path)),
                icon: "java-externalLibraries-icon",
                parent: undefined,
                expanded: false,
                classpathEntry: result,
                isRemoveable: isRemoveable
            } as ClasspathViewNode;
            return resultNode;
        }
        
        
    }

    removeClasspathNode(path: string): void {
        this.isDirty = true;
        this.currentClasspathItems.delete(path);
        this.updateTree();
    }

    get classpathItems(): ClasspathViewNode[] {
        return Array.from(this.currentClasspathItems.values());
    }

    private updateTree() {
        const rootNode = {
            id: 'class-path-root',
            name: 'Java class path',
            visible: false,
            parent: undefined,
            children: this.classpathItems
        } as CompositeTreeNode;
        this.root = rootNode;
    }

}