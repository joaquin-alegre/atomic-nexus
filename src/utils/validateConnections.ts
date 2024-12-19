import type { Connection, Edge, Node } from '@xyflow/react';

/**
 * Validates a connection between two nodes in the workflow.
 * @param connection - The connection being validated.
 * @param edges - The existing edges in the workflow.
 * @param nodes - The existing nodes in the workflow.
 * @returns `true` if the connection is valid, otherwise `false`.
 */
export const validateConnection = (
    connection: Connection, // The connection being attempted.
    edges: Edge[], // Existing edges in the workflow.
    nodes: Node[] // Existing nodes in the workflow.
): boolean => {
    const { source, target, targetHandle } = connection; // Extract details of the connection.

    // Check if the target handle is already connected.
    const targetAlreadyConnected = edges.some(
        (edge) => edge.target === target && edge.targetHandle === targetHandle
    );

    if (targetAlreadyConnected) return false; // Disallow duplicate connections to the same target handle.

    if (source === target) return false; // Prevent self-loops (a node connecting to itself).

    const targetNode = nodes.find((node) => node.id === target); // Find the target node in the node list.

    // Special validation for ForEach nodes with 'return' handles.
    if (targetNode?.type === 'ForEach' && targetHandle === 'return') {
        // Check if there are any output connections from the target node.
        const outputConnections = edges.filter(
            (edge) => edge.source === target && edge.sourceHandle === 'output'
        );

        if (outputConnections.length === 0) return false; // Require at least one output connection for the target node.

        // Recursive function to check if the source node is part of the output flow of the target node.
        const isSourceInOutputFlow = (currentNodeId: string): boolean => {
            const connectedEdges = edges.filter(
                (edge) => edge.source === currentNodeId
            );

            for (const edge of connectedEdges) {
                if (edge.target === source) return true; // Stop if we find a connection back to the source node.
                if (isSourceInOutputFlow(edge.target)) return true; // Recurse to check further connections.
            }
            return false; // Return false if no connection back to the source is found.
        };

        // Validate that at least one output connection leads back to the source node.
        return outputConnections.some((edge) =>
            isSourceInOutputFlow(edge.target)
        );
    }

    return true; // Allow the connection if all checks pass.
};
