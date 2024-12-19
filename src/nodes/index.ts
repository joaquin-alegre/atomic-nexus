import type { NodeTypes } from '@xyflow/react'; // Import type for defining custom node types.
import { ApiFetchNode } from './ApiFetchNode'; // Import the custom `ApiFetchNode` component.
import { ForEachNode } from './ForEachNode'; // Import the custom `ForEachNode` component.
import { AppNode } from './types'; // Import the `AppNode` type for consistent node structure.

export const initialNodes: AppNode[] = [
    // Define an initial node of type "ApiFetch".
    {
        id: 'a', // Unique identifier for the node.
        selected: false, // Indicates whether the node is currently selected.
        type: 'ApiFetch', // Type of the node, corresponding to `ApiFetchNode`.
        position: { x: 0, y: 300 }, // Position of the node on the React Flow canvas.
        data: {
            url: 'https://jsonplaceholder.typicode.com/users', // API endpoint URL.
            method: 'GET', // HTTP method for the request.
            queryString: '', // Empty query string for now.
            body: '', // Empty body (used for POST/PUT requests).
            headers: [], // Empty headers list.
            onExecute: undefined // Placeholder for the execution function.
        }
    },
    // Define a "ForEach" node.
    {
        id: 'b',
        selected: false,
        type: 'ForEach', // Type of the node, corresponding to `ForEachNode`.
        position: { x: 450, y: 600 },
        data: {
            arrayName: 'id', // Name of the array property to iterate over.
            array: [], // Empty array as a placeholder.
            onExecute: undefined // Placeholder for the execution function.
        }
    },
    // Another "ApiFetch" node targeting a different API endpoint.
    {
        id: 'c',
        selected: false,
        type: 'ApiFetch',
        position: { x: 900, y: 300 },
        data: {
            url: 'https://fake-json-api.mock.beeceptor.com/companies', // API endpoint URL.
            method: 'GET',
            queryString: '',
            body: '',
            headers: [],
            onExecute: undefined
        }
    },
    // Additional "ApiFetch" node for a different resource.
    {
        id: 'd',
        selected: false,
        type: 'ApiFetch',
        position: { x: 900, y: 700 },
        data: {
            url: 'https://fake-json-api.mock.beeceptor.com/customers', // API endpoint URL.
            method: 'GET',
            queryString: '',
            body: '',
            headers: [],
            onExecute: undefined
        }
    },
    // Another "ApiFetch" node for yet another resource.
    {
        id: 'e',
        selected: false,
        type: 'ApiFetch',
        position: { x: 450, y: 900 },
        data: {
            url: 'https://jsonplaceholder.typicode.com/todos', // API endpoint URL.
            method: 'GET',
            queryString: '',
            body: '',
            headers: [],
            onExecute: undefined
        }
    }
];

// Define the custom node types used in the application.
export const nodeTypes = {
    ApiFetch: ApiFetchNode, // Map the "ApiFetch" type to the `ApiFetchNode` component.
    ForEach: ForEachNode // Map the "ForEach" type to the `ForEachNode` component.
} satisfies NodeTypes; // Ensure the object satisfies the `NodeTypes` type.
