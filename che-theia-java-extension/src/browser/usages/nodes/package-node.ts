import { TreeNode, CompositeTreeNode, ExpandableTreeNode } from "@theia/core/lib/browser";
import { SearchResult, ElementNode } from "../usages-nodes";
import { SymbolKind } from "@theia/languages/lib/browser";

export class PackageNode implements CompositeTreeNode, ExpandableTreeNode {
   
    id: string;
    name: string;
    children: ReadonlyArray<TreeNode>;
    expanded: boolean;
    parent: Readonly<CompositeTreeNode> | undefined;

    constructor(pkg: SearchResult, parent: CompositeTreeNode | undefined) {
        this.id = "project-node";
        this.name = "blah blah";
        this.children = this.getChildren(pkg.children);
        this.expanded = true;
        this.parent = parent;
    }

    getChildren(children: SearchResult[]): TreeNode[] {
        const packageNodeChildren: TreeNode[] = [];
        for (const child of children) {
            if (child.kind === SymbolKind.File && child.matches.length === 0) {
                child.children.forEach(grandChild => packageNodeChildren.push(ElementNode.create(grandChild, undefined)));
            } else {
                packageNodeChildren.push(ElementNode.create(child, undefined));
            }
        }
        return packageNodeChildren;
    }

}