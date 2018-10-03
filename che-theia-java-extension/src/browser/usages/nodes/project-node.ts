import { TreeNode, CompositeTreeNode, ExpandableTreeNode } from "@theia/core/lib/browser";
import { SearchResult } from "../usages-nodes";
import { PackageNode } from "./package-node";

export class ProjectNode implements CompositeTreeNode, ExpandableTreeNode {
   
    id: string;
    name: string;
    children: ReadonlyArray<TreeNode>;
    expanded: boolean;
    parent: Readonly<CompositeTreeNode> | undefined;

    constructor(name: string, results: SearchResult[], parent: CompositeTreeNode) {
        this.id = parent.id + "-" + name;
        this.name = name;
        this.children = this.getChildren(results);
        this.expanded = true;
        this.parent = parent;
    }

    getChildren(results: SearchResult[]) {
        return results.map(result => new PackageNode(result, this));
    }

}