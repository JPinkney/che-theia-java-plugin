import { TreeNode, CompositeTreeNode, ExpandableTreeNode } from "@theia/core/lib/browser";
import { UsagesResponse } from "../usages-nodes";
import { ProjectNode } from "./project-node";

export class UsagesNode implements CompositeTreeNode, ExpandableTreeNode {
   
    id: string;
    name: string;
    children: ReadonlyArray<TreeNode>;
    expanded: boolean;
    parent: Readonly<CompositeTreeNode> | undefined;

    constructor(response: UsagesResponse, parent: CompositeTreeNode | undefined) {
        this.id = "usages-root";
        this.name = this.getUsagesName(response);
        this.children = this.getChildren(response);
        this.expanded = true;
        this.parent = parent;
    }

    getUsagesName(response: UsagesResponse): string {
        return `Usages of ${response.searchedElement} [${response.searchResults.length} occurances]`;
    }

    getChildren(response: UsagesResponse) {
        return response.searchResults.map(result => 
            new ProjectNode(result.name, result.children, this)
        );
    }

}