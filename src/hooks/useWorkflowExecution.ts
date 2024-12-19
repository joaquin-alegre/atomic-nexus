/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Edge, Node } from '@xyflow/react'; // Import React Flow types for nodes and edges.

export interface WorkflowResult {
    nodeId: string; // The ID of the node.
    type: string; // The type of the node.
    data: any; // The result data produced by executing the node.
}

// Custom hook for executing workflows.
export const useWorkflowExecution = () => {
    // State to store the results of the workflow execution.
    const [workflowResults, setWorkflowResults] = useState<WorkflowResult[]>(
        []
    );

    // State to track if the workflow execution is in progress.
    const [isExecuting, setIsExecuting] = useState(false);

    // Function to execute the workflow.
    const executeWorkflow = async (
        nodes: Node[], // List of all nodes in the workflow.
        edges: Edge[], // List of all edges connecting the nodes.
        onNodeExecute: (nodeId: string, type: string) => Promise<any> // Callback to execute a node by ID and type.
    ) => {
        setIsExecuting(true); // Set execution state to true.
        setWorkflowResults([]); // Clear previous results.

        try {
            // Find the start node (a node without any incoming edges).
            const startNode = nodes.find(
                (node) => !edges.some((edge) => edge.target === node.id)
            );

            if (!startNode) {
                throw new Error('No start node found'); // Throw an error if no start node exists.
            }

            // Traverse nodes starting from the start node.
            await traverseNodes(startNode, nodes, edges, onNodeExecute);
        } catch (error) {
            console.error('Workflow execution error:', error); // Log any execution errors.
        } finally {
            setIsExecuting(false); // Set execution state to false when done.
        }
    };

    // Function to traverse nodes recursively.
    const traverseNodes = async (
        currentNode: Node, // The current node being executed.
        nodes: Node[], // List of all nodes.
        edges: Edge[], // List of all edges.
        onNodeExecute: (nodeId: string, type: string) => Promise<any> // Callback to execute a node.
    ) => {
        // Execute the current node using the provided callback.
        const result = await onNodeExecute(
            currentNode.id,
            currentNode.type || '' // Default to an empty string if the type is undefined.
        );

        // Save the execution result in the workflow results state.
        setWorkflowResults((prev) => [
            ...prev,
            {
                nodeId: currentNode.id,
                type: currentNode.type || '',
                data: result
            }
        ]);

        // Find all outgoing edges from the current node.
        const outgoingEdges = edges.filter(
            (edge) => edge.source === currentNode.id
        );

        // Recursively traverse and execute all connected nodes.
        for (const edge of outgoingEdges) {
            const nextNode = nodes.find((node) => node.id === edge.target); // Find the target node of the edge.
            if (nextNode) {
                await traverseNodes(nextNode, nodes, edges, onNodeExecute); // Recursively execute the next node.
            }
        }
    };

    return {
        executeWorkflow, // Function to start workflow execution.
        workflowResults, // Results of the workflow execution.
        isExecuting // Boolean indicating if the workflow is currently executing.
    };
};
