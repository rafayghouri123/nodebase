
import { Connection, Node } from "@/generated/prisma/client"
import toposort from "toposort" 


export const topoLogicalSort = (nodes: Node[], connections: Connection[]): Node[] => {

    if (connections.length === 0) {
        return nodes
    }

    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ])

    let sortedNodeIds: string[];

    try {
        sortedNodeIds = toposort(edges)
        sortedNodeIds = [...new Set(sortedNodeIds)]
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle")
        }
        throw error
    }

    const nodeMap = new Map(nodes.map(n => [n.id, n]))

    // add nodes that are disconnected (not present in sorted result)
    for (const node of nodes) {
        if (!sortedNodeIds.includes(node.id)) {
            sortedNodeIds.push(node.id)
        }
    }

    return sortedNodeIds.map(id => nodeMap.get(id)!).filter(Boolean)
}
