// Interface representing an edge connection in the workflow.
interface Header {
    source: string; // Source node ID.
    target: string; // Target node ID.
    sourceHandle: string; // Handle type on the source node (e.g., "output", "return").
}

// Interface for the parameters accepted by the `executeForEachNode` function.
interface ExecuteForEachNodeParams {
    id: string; // ID of the "ForEach" node being executed.
    array: any[] | undefined; // The array to iterate over.
    arrayName: string; // The property name in the array's items to process.
    getConnectedEdges: (handleType: string) => Header[]; // Function to get connected edges by handle type.
    nodeExecuteFns: Record<string, (inputData: any) => Promise<any>>; // Map of execution functions for connected nodes.
}

/**
 * Executes a "ForEach" node by iterating over an array and triggering connected nodes.
 * @param id - ID of the "ForEach" node being executed.
 * @param array - Array to iterate over.
 * @param arrayName - Property name to extract from each array item.
 * @param getConnectedEdges - Function to retrieve edges connected to specific handles.
 * @param nodeExecuteFns - Execution functions for connected nodes.
 * @returns An object containing the results of node executions and any errors encountered.
 */
export const executeForEachNode = async ({
    id,
    array,
    arrayName,
    getConnectedEdges,
    nodeExecuteFns
}: ExecuteForEachNodeParams): Promise<{ results: any[]; errors: string[] }> => {
    // Validate the array input.
    if (!array || !Array.isArray(array)) {
        console.error(`[FOREACH Node ${id}]: Invalid array input provided.`);
        return { results: [], errors: [`Input is not a valid array.`] };
    }

    console.log(nodeExecuteFns); // Debugging: Log available execution functions.

    // Retrieve edges connected to the "output" and "return" handles.
    const outputEdges = getConnectedEdges('output');
    const returnEdges = getConnectedEdges('return');
    const results: any[] = []; // Array to store execution results.
    const errors: string[] = []; // Array to store error messages.

    // Iterate over the array.
    for (let index = 0; index < array.length; index++) {
        const item = array[index]; // Current array item.
        const itemData = arrayName ? item[arrayName] : item; // Extract the property specified by `arrayName`.

        // Handle missing or invalid item data.
        if (!itemData) {
            const errorMessage = `[FOREACH Node ${id}]: Missing property '${arrayName}' in array item at index ${index}.`;
            console.warn(errorMessage);
            errors.push(errorMessage);
            continue;
        }

        // Execute all connected "output" nodes for the current item.
        for (const edge of outputEdges) {
            const targetNodeId = edge.target; // Target node ID for the edge.
            const executeTargetNode = nodeExecuteFns[targetNodeId]; // Get the execution function for the target node.

            if (executeTargetNode) {
                try {
                    // Execute the target node and store the result.
                    const result = await executeTargetNode(itemData);
                    results.push({ item: itemData, nodeResult: result });
                } catch (error) {
                    // Handle execution errors for the target node.
                    const executionError = `[FOREACH Node ${id} -> ${targetNodeId}]: Execution error at index ${index}: ${error}`;
                    console.error(executionError);
                    errors.push(executionError);
                }
            } else {
                // Handle missing execution function for the target node.
                const missingFnError = `[FOREACH Node ${id}]: No execution function for target node ${targetNodeId}.`;
                console.warn(missingFnError);
                errors.push(missingFnError);
            }
        }
    }

    // Execute all connected "return" nodes with a summary of results and errors.
    for (const edge of returnEdges) {
        const targetNodeId = edge.target; // Target node ID for the "return" edge.
        const executeReturnNode = nodeExecuteFns[targetNodeId]; // Get the execution function for the return node.

        if (executeReturnNode) {
            try {
                // Execute the return node with a summary object.
                await executeReturnNode({
                    summary: results.length, // Total number of successful results.
                    details: results, // Details of all execution results.
                    errors // List of errors encountered during execution.
                });
            } catch (error) {
                // Handle errors during return node execution.
                const returnError = `[FOREACH Node ${id} -> ${targetNodeId}]: Return execution error: ${error}`;
                console.error(returnError);
                errors.push(returnError);
            }
        } else {
            // Handle missing execution function for the return node.
            const missingReturnFnError = `[FOREACH Node ${id}]: No return function for target node ${targetNodeId}.`;
            console.warn(missingReturnFnError);
            errors.push(missingReturnFnError);
        }
    }

    // Return the results and errors.
    return { results, errors };
};
