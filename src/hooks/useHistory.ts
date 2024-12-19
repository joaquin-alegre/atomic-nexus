import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react'; // Import React Flow types.

interface HistoryState {
    nodes: Node[]; // State of nodes at a specific point in time.
    edges: Edge[]; // State of edges at a specific point in time.
}

// Custom hook to manage undo/redo history for nodes and edges in React Flow.
export function useHistory(initialNodes: Node[], initialEdges: Edge[]) {
    const [history, setHistory] = useState<HistoryState[]>([]); // Undo stack.
    const [redoStack, setRedoStack] = useState<HistoryState[]>([]); // Redo stack.

    // Function to add a new state to the history.
    const pushToHistory = useCallback(
        (nodes: Node[], edges: Edge[]) => {
            setHistory((prev) => {
                if (prev.length === 0) {
                    // Add the initial state on the first action.
                    return [
                        { nodes: initialNodes, edges: initialEdges },
                        { nodes, edges }
                    ];
                }

                const lastState = prev[prev.length - 1];
                // Avoid redundant states by comparing with the last state.
                if (
                    lastState &&
                    JSON.stringify(lastState.nodes) === JSON.stringify(nodes) &&
                    JSON.stringify(lastState.edges) === JSON.stringify(edges)
                ) {
                    return prev; // Skip adding redundant states.
                }

                return [...prev, { nodes, edges }]; // Add the new state.
            });
            setRedoStack([]); // Clear the redo stack when a new action occurs.
        },
        [initialNodes, initialEdges]
    );

    // Function to undo the last action.
    const undo = useCallback(
        (
            setNodes: (nodes: Node[]) => void, // Function to update nodes in React Flow.
            setEdges: (edges: Edge[]) => void // Function to update edges in React Flow.
        ) => {
            if (history.length > 1) {
                // Ensure there's a previous state to undo to.
                const currentState = history[history.length - 1]; // Get the current state.
                setRedoStack((prev) => [currentState, ...prev]); // Move the current state to the redo stack.
                setHistory((prev) => prev.slice(0, -1)); // Remove the last state from the history.

                const previousState = history[history.length - 2]; // Get the previous state.
                setNodes(previousState.nodes); // Restore nodes to the previous state.
                setEdges(previousState.edges); // Restore edges to the previous state.
            }
        },
        [history]
    );

    // Function to redo the last undone action.
    const redo = useCallback(
        (
            setNodes: (nodes: Node[]) => void, // Function to update nodes in React Flow.
            setEdges: (edges: Edge[]) => void // Function to update edges in React Flow.
        ) => {
            if (redoStack.length > 0) {
                // Ensure there's a state in the redo stack.
                const nextState = redoStack[0]; // Get the next state to redo.
                setRedoStack((prev) => prev.slice(1)); // Remove the first state from the redo stack.
                setHistory((prev) => [...prev, nextState]); // Add the state to the undo stack.

                if (nextState) {
                    setNodes(nextState.nodes); // Restore nodes to the redo state.
                    setEdges(nextState.edges); // Restore edges to the redo state.
                }
            }
        },
        [redoStack]
    );

    // Return the undo/redo functionality and the history stacks for inspection.
    return { pushToHistory, undo, redo, history, redoStack };
}
