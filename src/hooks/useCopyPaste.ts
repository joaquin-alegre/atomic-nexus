import { useCallback, useEffect } from 'react';
import { setCopiedNode, getCopiedNode } from '../utils/clipboard'; // Utility functions to handle node copying and retrieval.

interface UseCopyPasteProps {
    setNodes: (nodes: any[]) => void; // Function to update the list of nodes.
    nodes: any[]; // Current list of nodes.
}

// Custom hook to handle copy-paste functionality for nodes.
export function useCopyPaste({ setNodes, nodes }: UseCopyPasteProps) {
    // Function to copy the currently selected node.
    const copyNode = useCallback(() => {
        const selectedNode = nodes.find((node) => node.selected); // Find the currently selected node.
        if (selectedNode) {
            setCopiedNode(selectedNode); // Save the selected node to the clipboard.
            console.log(
                `Node ${selectedNode.id} copied with full configuration!`
            );
        } else {
            console.warn('No node selected for copying.'); // Warn if no node is selected.
        }
    }, [nodes]);

    // Function to paste a copied node at a specific or default position.
    const pasteNode = useCallback(
        (position?: { x: number; y: number }) => {
            const copiedNode = getCopiedNode(); // Retrieve the copied node from the clipboard.
            if (!copiedNode) {
                console.warn('No node in clipboard to paste.'); // Warn if no node is in the clipboard.
                return;
            }

            // Create a new node based on the copied node with a unique ID and optional position.
            const newNode = {
                ...copiedNode,
                id: `${copiedNode.id}-copy-${Date.now()}`, // Generate a unique ID for the new node.
                position: position || {
                    // Set the position relative to the copied node's position.
                    x: copiedNode.position.x + 50,
                    y: copiedNode.position.y + 50
                },
                selected: true // Automatically select the new node.
            };

            // Add the new node to the current list of nodes, deselecting others.
            setNodes(
                (nodes) =>
                    nodes
                        .map((node) => ({ ...node, selected: false })) // Deselect all existing nodes.
                        .concat(newNode) // Add the new node.
            );

            console.log(`Node pasted with ID: ${newNode.id}`);
        },
        [setNodes]
    );

    // Keyboard event handler for copy-paste shortcuts.
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const activeElement = document.activeElement as HTMLElement | null;

            // Ignore keyboard shortcuts if an input field is focused.
            const isInputField =
                activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.hasAttribute('contenteditable'));

            if (isInputField) return;

            // Handle `Ctrl+C` or `Cmd+C` for copying.
            if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                event.preventDefault(); // Prevent the default copy behavior.
                copyNode();
            }

            // Handle `Ctrl+V` or `Cmd+V` for pasting.
            if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
                event.preventDefault(); // Prevent the default paste behavior.
                pasteNode();
            }
        },
        [copyNode, pasteNode]
    );

    // Add and remove the keyboard event listener for copy-paste shortcuts.
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown); // Attach the event listener on mount.
        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Detach the event listener on unmount.
        };
    }, [handleKeyDown]);

    // Return the copy and paste functions to be used in the component.
    return { copyNode, pasteNode };
}
