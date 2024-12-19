import React, { useState, useEffect, useCallback } from 'react';
import { EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react'; // React Flow utilities for edge rendering and state management.
import { FiX } from 'react-icons/fi'; // Icon for the delete button.

// Define the props for the custom deletable edge component.
export interface CustomDeletableEdgeProps extends EdgeProps {
  onDelete: (id: string) => void; // Callback function to handle edge deletion.
  pushToHistory: (nodes: unknown[], edges: unknown[]) => void; // Function to update history for undo/redo functionality.
}

// Functional component for a custom edge with delete functionality.
export const CustomDeletableEdge: React.FC<CustomDeletableEdgeProps> = ({
  id, // Unique ID of the edge.
  sourceX, // X coordinate of the source node's connection point.
  sourceY, // Y coordinate of the source node's connection point.
  targetX, // X coordinate of the target node's connection point.
  targetY, // Y coordinate of the target node's connection point.
  sourcePosition, // Position of the source node (e.g., left, right).
  targetPosition, // Position of the target node (e.g., left, right).
  selected, // Boolean indicating if the edge is currently selected.
  markerEnd, // Optional marker (e.g., arrowhead) at the end of the edge.
  style, // Optional custom styles for the edge.
  onDelete, // Callback to handle edge deletion.
  pushToHistory, // Function to push state updates to history.
}) => {
  const [hovered, setHovered] = useState(false); // State to track if the edge is hovered.
  const { getNodes, getEdges } = useReactFlow(); // React Flow hooks to access current nodes and edges.

  // Generate a smooth path for the edge using source/target positions.
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Function to handle the deletion of the edge.
  const handleDeleteEdge = useCallback(() => {
    onDelete(id); // Call the onDelete callback with the edge ID.
    pushToHistory(getNodes(), getEdges()); // Update the history for undo/redo.
  }, [id, pushToHistory, getNodes, getEdges, onDelete]);

  // Effect to listen for keyboard events for edge deletion.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' && selected) { 
        handleDeleteEdge(); // Delete the edge when Backspace is pressed and it's selected.
      }
    };
    document.addEventListener('keydown', handleKeyDown); // Add event listener.
    return () => document.removeEventListener('keydown', handleKeyDown); // Cleanup listener on unmount.
  }, [selected, handleDeleteEdge]);

  return (
    <>
      <g
        onMouseEnter={() => setHovered(true)} // Set hovered to true when the mouse enters.
        onMouseLeave={() => setHovered(false)} // Set hovered to false when the mouse leaves.
      >
        {/* Clickable area for the edge (larger than the visible line). */}
        <path
          d={edgePath} // Use the generated smooth edge path.
          fill="transparent" // Transparent fill.
          strokeWidth={20} // Width of the clickable area.
          className="edge-hover-area" // Custom class for hover detection.
          onClick={() => console.log(`Edge ${id} clicked`)} // Example action when the edge is clicked.
        />

        {/* The visible line of the edge. */}
        <path
          id={id} // Set the edge ID for reference.
          d={edgePath} // Use the same smooth edge path.
          className={`animated-edge ${selected ? 'stroke-selected' : 'stroke-default'}`} // Apply styles based on selection.
          markerEnd={markerEnd} // Optional marker at the end of the edge.
          style={style} // Apply custom styles if provided.
        />

        {/* Delete button (visible on hover or when the edge is selected). */}
        {(hovered || selected) && (
          <foreignObject
            x={labelX - 12} // Position the button at the label's X coordinate.
            y={labelY - 12} // Position the button at the label's Y coordinate.
            width={24} // Width of the foreignObject container.
            height={24} // Height of the foreignObject container.
          >
            <div className={`edge-delete-btn ${selected ? "delete-btn-active" : ""}`}>
              {/* Delete button with a click handler. */}
              <button onClick={handleDeleteEdge} className="delete-btn">
                <FiX size={20} /> {/* Render the delete icon. */}
              </button>
            </div>
          </foreignObject>
        )}
      </g>
    </>
  );
};
