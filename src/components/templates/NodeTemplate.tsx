import React, { useCallback, useRef, useState, useEffect } from "react";
import { FiPackage, FiCpu, FiTrash, FiCopy, FiClipboard, FiMoreVertical } from "react-icons/fi";
import { useReactFlow } from "@xyflow/react"; // Import hooks from React Flow for managing nodes and edges.
import { useCopyPaste } from "../../hooks/useCopyPaste"; // Custom hook for handling copy-paste functionality.

interface NodeTemplateProps {
  children: React.ReactNode; // Content to be rendered inside the node.
  type: "ApiFetch" | "ForEach"; // Defines the type of the node.
  id: string; // Unique identifier for the node.
  selected: boolean; // Indicates if the node is currently selected.
  pushToHistory: (nodes: unknown[], edges: unknown[]) => void; // Function to record node/edge changes for undo/redo functionality.
}

// Functional component that represents a node template.
export const NodeTemplate: React.FC<NodeTemplateProps> = ({ children, type, id, selected, pushToHistory }) => {
  // React Flow functions for managing nodes and edges.
  const { deleteElements, setNodes, getNodes, getNode, getEdges } = useReactFlow();

  // Custom copy-paste hook initialized with nodes and setNodes function.
  const { copyNode, pasteNode } = useCopyPaste({ setNodes, nodes: getNodes() });

  const [showMenu, setShowMenu] = useState(false); // State to toggle the visibility of the context menu.
  const menuRef = useRef<HTMLDivElement>(null); // Ref to track the context menu element.

  // Function to handle clicks outside of the context menu and close it.
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false); // Close the menu if the click is outside.
    }
  }, []);

  // Effect to add/remove the event listener for outside clicks based on `showMenu`.
  useEffect(() => {
    if (showMenu) document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showMenu, handleOutsideClick]);

  // Function to toggle the context menu and select the current node.
  const toggleMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent the event from propagating further.
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: node.id === id, // Select the current node by ID.
        }))
      );
      setShowMenu((prev) => !prev); // Toggle the menu visibility.
    },
    [id, setNodes]
  );

  // Function to delete the current node.
  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] }); // Remove the node using its ID.
    pushToHistory(getNodes(), getEdges()); // Update the history after deletion.
  }, [id, deleteElements, getNodes, getEdges, pushToHistory]);

  // Function to paste a node near the current node.
  const onPaste = useCallback(() => {
    const currentNode = getNode(id);
    if (currentNode) {
      pasteNode({ x: currentNode.position.x + 50, y: currentNode.position.y + 50 }); // Paste node at an offset position.
      setShowMenu(false); // Close the menu.
      pushToHistory(getNodes(), getEdges()); // Update the history after pasting.
    }
  }, [id, pasteNode, getNode, pushToHistory, getNodes, getEdges]);

  return (
    <div className="relative flex flex-col gap-1 w-96">
      {/* Header section */}
      <div
        className={`flex justify-between px-2 py-2 rounded-md ${
          type === "ApiFetch" ? "bg-primary-green" : "bg-primary-blue"
        } ${
          selected ? (type === "ApiFetch" ? "shadow-highlight-green" : "shadow-higlight-blue") : ""
        }`}
      >
        {/* Node title with icon */}
        <h1 className="flex items-center gap-2 text-sm font-semibold text-neutral-50">
          {type === "ApiFetch" ? <FiPackage size={16} /> : <FiCpu size={16} />}
          {type === "ApiFetch" ? `API Fetch Node: ${id}` : `For Each Node: ${id}`}
        </h1>

        {/* Context menu toggle button */}
        <button onClick={toggleMenu} className="text-neutral-50 hover:text-gray-300">
          <FiMoreVertical size={18} />
        </button>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="text-sm absolute right-4 top-8 w-40 bg-paper text-white border border-neutral-700 rounded shadow-lg z-10"
        >
          {/* Copy action */}
          <button
            onClick={() => {
              copyNode(); // Trigger the copy action.
              setShowMenu(false); // Close the menu.
            }}
            className="menu-item"
          >
            <FiCopy /> Copy
          </button>

          {/* Paste action */}
          <button onClick={onPaste} className="menu-item">
            <FiClipboard /> Paste here
          </button>

          {/* Delete action */}
          <button onClick={onDelete} className="menu-item">
            <FiTrash /> Delete
          </button>
        </div>
      )}

      {/* Content section */}
      <div
        className={`bg-node-body p-4 rounded-md ${
          selected ? (type === "ApiFetch" ? "shadow-highlight-green" : "shadow-higlight-blue") : ""
        }`}
      >
        {children} {/* Render the children (custom node content). */}
      </div>
    </div>
  );
};