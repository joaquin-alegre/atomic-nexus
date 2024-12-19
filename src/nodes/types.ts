import type { Node } from '@xyflow/react'; // Import the Node type from React Flow.

// Define the type for an "ApiFetch" node.
export type ApiFetchNode = Node<
    {
        url: string; // The URL for the API request.
        method: 'GET' | 'POST' | 'PUT' | 'DELETE'; // The HTTP method for the request.
        queryString: string; // The query string for the request.
        body: string; // The request body (used for POST/PUT).
        headers: { key: string; value: string }[]; // Array of headers with key-value pairs.
        onExecute?: (
            inputData: any, // Input data for the node execution.
            nodeExecuteFns: Record<string, any> // A record of execution functions for connected nodes.
        ) => Promise<any>; // Asynchronous function that resolves with the execution result.
    },
    'ApiFetch' // The type name of the node (matches the type used in the `nodeTypes` map).
>;

// Define the type for a "ForEach" node.
export type ForEachNode = Node<
    {
        arrayName: string; // The name of the property representing the array to iterate over.
        array: any[]; // The array to process during execution.
        onExecute?: (
            inputData: any, // Input data for the node execution.
            nodeExecuteFns: Record<string, any> // A record of execution functions for connected nodes.
        ) => Promise<any>; // Asynchronous function that resolves with the execution result.
    },
    'ForEach' // The type name of the node (matches the type used in the `nodeTypes` map).
>;

// Union type for application nodes, supporting both "ApiFetch" and "ForEach" nodes.
export type AppNode = ApiFetchNode | ForEachNode;
