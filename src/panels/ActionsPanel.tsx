import React, { useRef, useCallback } from "react";
import { useReactFlow } from "@xyflow/react"; // React Flow hooks for accessing the flow instance.
import {
  FiSave,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiPlay,
} from "react-icons/fi"; // Icons for the action buttons.
import { IconButton } from "../components/IconButton"; // Reusable button component with tooltips and icons.

interface ActionsPanelProps {
  undo: () => void; // Function to undo the last action.
  redo: () => void; // Function to redo the last undone action.
  runWorkflow: () => Promise<void>; // Function to execute the workflow.
  canUndo: boolean; // Boolean indicating if undo is possible.
  canRedo: boolean; // Boolean indicating if redo is possible.
}

// Helper function to download a JSON file.
const downloadJsonFile = (filename: string, data: object) => {
  const dataStr = JSON.stringify(data, null, 2); // Convert the data to a formatted JSON string.
  const blob = new Blob([dataStr], { type: "application/json" }); // Create a blob with the JSON data.
  const url = URL.createObjectURL(blob); // Create a temporary URL for the blob.
  const link = document.createElement("a"); // Create a temporary anchor element.
  link.href = url; // Set the href to the blob URL.
  link.download = filename; // Set the filename for the download.
  link.click(); // Trigger the download.
  URL.revokeObjectURL(url); // Clean up the blob URL.
};

// Actions Panel Component
export const ActionsPanel: React.FC<ActionsPanelProps> = ({
  undo,
  redo,
  runWorkflow,
  canUndo,
  canRedo,
}) => {
  const reactFlowInstance = useReactFlow(); // Access the React Flow instance.
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the hidden file input.

  // Function to save the current flow as a JSON file.
  const handleSave = useCallback(() => {
    const flow = {
      nodes: reactFlowInstance.getNodes(), // Get all nodes from the React Flow instance.
      edges: reactFlowInstance.getEdges(), // Get all edges from the React Flow instance.
    };
    downloadJsonFile("workflow.json", flow); // Save the flow as a JSON file.
  }, [reactFlowInstance]);

  // Function to load a flow from a JSON file.
  const handleLoad = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]; // Get the selected file.
      if (!file) return;

      const reader = new FileReader(); // Create a FileReader to read the file.
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string; // Get the file content as text.
          const flow = JSON.parse(text); // Parse the JSON content.
          if (flow?.nodes) reactFlowInstance.setNodes(flow.nodes); // Set the nodes in React Flow.
          if (flow?.edges) reactFlowInstance.setEdges(flow.edges); // Set the edges in React Flow.
        } catch (error) {
          console.error("Failed to load workflow file:", error); // Log an error if the file is invalid.
          alert("Invalid workflow file. Please upload a valid JSON file."); // Show an error message to the user.
        }
      };
      reader.readAsText(file); // Read the file as text.
    },
    [reactFlowInstance]
  );

  return (
    <div className="flex space-x-2 bg-transparent p-2 rounded-lg">
      {/* Undo Button */}
      <IconButton
        onClick={undo}
        disabled={!canUndo} // Disable the button if undo is not possible.
        tooltip="Undo" // Tooltip text.
        icon={<FiRotateCcw />} // Undo icon.
      />
      {/* Redo Button */}
      <IconButton
        onClick={redo}
        disabled={!canRedo} // Disable the button if redo is not possible.
        tooltip="Redo" // Tooltip text.
        icon={<FiRotateCw />} // Redo icon.
      />
      {/* Save Button */}
      <IconButton
        onClick={handleSave} // Save the flow as a JSON file.
        tooltip="Save" // Tooltip text.
        icon={<FiSave />} // Save icon.
      />
      {/* Load Button */}
      <IconButton
        onClick={() => fileInputRef.current?.click()} // Trigger the hidden file input.
        tooltip="Load" // Tooltip text.
        icon={<FiUpload />} // Load icon.
      />
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".json" // Accept only JSON files.
        ref={fileInputRef} // Reference to the input element.
        style={{ display: "none" }} // Hide the file input.
        onChange={handleLoad} // Handle file loading.
      />
      {/* Run Button */}
      <IconButton
        onClick={runWorkflow} // Execute the workflow.
        tooltip="Run" // Tooltip text.
        icon={<FiPlay />} // Play icon.
        className="hover:bg-primary-green" // Additional styling for hover.
      />
    </div>
  );
};
