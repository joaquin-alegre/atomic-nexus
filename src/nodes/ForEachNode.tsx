import React, { useEffect, useCallback } from "react";
import { Handle, Position } from "@xyflow/react"; // Import React Flow components.
import { NodeTemplate } from "../components/templates/NodeTemplate"; // Custom template for node rendering.
import { executeForEachNode } from "../utils/executeForEachNode"; // Utility function for executing the "ForEach" node logic.
import { useGlobalState } from "../context/StateContext"; // Import the global state hook.

interface ForEachNodeData {
  arrayName: string; // Name of the array property.
  array?: any[]; // The array to iterate over.
  onExecute?: (inputData: any) => Promise<any>; // Optional callback for node execution.
}

type NodeProps = {
  id: string; // Node ID.
  data: ForEachNodeData; // Node-specific data.
  selected: boolean; // Whether the node is selected.
};

// ForEach Node Component
export const ForEachNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const { setNodes, edges } = useGlobalState(); // Access global state setters and getters.

  // Function to get edges connected to a specific handle type.
  const getConnectedEdges = useCallback(
    (handleType: string) =>
      edges.filter(
        (edge) => edge.source === id && edge.sourceHandle === handleType
      ),
    [id, edges]
  );

  // Update the node's execution logic in the global state.
  useEffect(() => {
    const updateExecutionLogic = async () => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  onExecute: (inputData: any, nodeExecuteFns: any) => {
                    if (!nodeExecuteFns || typeof nodeExecuteFns !== "object") {
                      console.error(
                        `[FOREACH Node ${id}]: nodeExecuteFns is invalid or missing.`
                      );
                      return Promise.reject("Invalid nodeExecuteFns");
                    }

                    return executeForEachNode({
                      id,
                      array: inputData || data.array, // Use inputData if provided, otherwise use the node's array.
                      arrayName: data.arrayName, // Pass the array property name.
                      getConnectedEdges, // Function to retrieve connected edges.
                      nodeExecuteFns, // Functions to execute connected nodes.
                    });
                  },
                },
              }
            : node
        )
      );
    };
    updateExecutionLogic();
  }, [id, data, setNodes, getConnectedEdges]);

  // Handle changes to input fields and update the node's data in the global state.
  const handleInputChange = (field: keyof ForEachNodeData, value: any) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      )
    );

    if (field === "arrayName" && value.trim() === "") {
      console.warn(
        `[FOREACH Node ${id}]: Array Property Name cannot be empty.`
      );
    }
  };

  return (
    <NodeTemplate
      type="ForEach"
      id={id}
      selected={selected}
      pushToHistory={() => console.log("Push to history")} // Placeholder for pushToHistory
    >
      {/* Main content of the node */}
      <div className="flex flex-col gap-4">
        {/* Input for the array property name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-300">
            Array Property Name:
          </label>
          <input
            type="text"
            value={data.arrayName}
            onChange={(e) => handleInputChange("arrayName", e.target.value)}
            className="p-2 border border-gray-500 rounded text-white"
            placeholder="Enter array name"
          />
        </div>
      </div>

      {/* Handles for connecting edges */}
      {/* Input handle on the left */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="input-handle"
        style={{
          width: "12px",
          height: "12px",
          background: "#3b3b3b",
          border: "1px solid #d1d5db",
        }}
      />

      {/* Output handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="input-handle"
        style={{
          width: "12px",
          height: "12px",
          background: "#3b3b3b",
          border: "1px solid #d1d5db",
        }}
      />

      {/* Return handle on the bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="return"
        className="input-handle"
        style={{
          width: "12px",
          height: "12px",
          background: "#3b3b3b",
          border: "1px solid #d1d5db",
        }}
      />
    </NodeTemplate>
  );
};
