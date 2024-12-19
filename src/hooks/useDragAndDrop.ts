import { useCallback } from 'react';
import { XYPosition } from '@xyflow/react'; // Import necessary types from React Flow.
import { useGlobalState } from '../context/StateContext'; // Import global state hook.

export function useDragAndDrop() {
    const {
        reactFlowWrapper, // React Flow wrapper ref from context.
        reactFlowInstance, // React Flow instance from context.
        setNodes // Global setter for nodes.
    } = useGlobalState(); // Access global state.

    // Handler for drag-over events on the React Flow canvas.
    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allow dropping by preventing the default behavior.
        event.dataTransfer.dropEffect = 'move'; // Visual feedback for a "move" operation.
    }, []);

    // Helper function to create a new node with the given type and position.
    const createNode = useCallback((type: string, position: XYPosition) => {
        return {
            id: `${type}-${Date.now()}`, // Generate a unique ID using the node type and current timestamp.
            type, // Set the node type.
            position, // Use the provided position.
            data: { label: `${type} Node` } // Default data with a label.
        };
    }, []);

    // Handler for drop events on the React Flow canvas.
    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            // Ensure the React Flow wrapper and instance are available.
            if (!reactFlowWrapper.current || !reactFlowInstance) {
                console.error(
                    'React Flow wrapper or instance is not available.'
                );
                return;
            }

            // Get the bounding rectangle of the React Flow wrapper.
            const reactFlowBounds =
                reactFlowWrapper.current.getBoundingClientRect();
            // Retrieve the node type from the drag-and-drop data.
            const type = event.dataTransfer.getData('application/reactflow');

            if (!type) {
                console.error('Invalid node type:', type); // Log an error if the type is invalid.
                return;
            }

            // Calculate the position for the new node in the flow coordinates.
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left, // Adjust X position relative to the wrapper bounds.
                y: event.clientY - reactFlowBounds.top // Adjust Y position relative to the wrapper bounds.
            });

            // Create a new node with the specified type and calculated position.
            const newNode = createNode(type, position);

            // Add the new node to the global state.
            setNodes((currentNodes) => [...currentNodes, newNode]);
        },
        [reactFlowWrapper, reactFlowInstance, createNode, setNodes]
    );

    // Return the handlers to be used in the component.
    return { onDragOver, onDrop };
}
