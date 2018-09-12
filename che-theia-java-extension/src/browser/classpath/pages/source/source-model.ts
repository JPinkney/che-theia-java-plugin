import { ClasspathEntry, ClasspathEntryKind } from "../../classpath-container";
import { LabelProvider, TreeModelImpl, CompositeTreeNode } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { injectable, inject } from "inversify";
import { IClasspathModel } from "../classpath-model";
import { ClasspathViewNode } from "../../nodes/classpath-node";

 @injectable()
 export class SourceModel extends TreeModelImpl implements IClasspathModel {

    isDirty = false;

    private currentClasspathItems: Map<string, ClasspathViewNode> = new Map();

    constructor(@inject(LabelProvider) protected readonly labelProvider: LabelProvider) {
        super();
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
        this.updateTree();
    }

    createClasspathNode(result: ClasspathEntry) {
        const resultNode = {
            id: result.path,
            name: this.labelProvider.getLongName(new URI(result.path)),
            icon: "java-source-folder-icon",
            parent: undefined,
            classpathEntry: result,
            isRemoveable: true
        } as ClasspathViewNode;
        
        return resultNode;
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