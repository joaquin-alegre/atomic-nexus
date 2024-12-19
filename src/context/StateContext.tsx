import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Node, Edge } from "@xyflow/react"; // Import Node and Edge types.
import { useWorkflowExecution } from "../hooks/useWorkflowExecution";
import { useHistory } from "../hooks/useHistory"; // Import the useHistory hook.

interface GlobalState {
  onAddNode: (type: string) => void; // Function to add a node.
  nodes: Node[]; // List of nodes.
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>; // Function to update nodes.
  edges: Edge[]; // List of edges.
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>; // Function to update edges.
  workflowResults: Record<string, any>; // Results of the workflow execution.
  copiedNode: Node | null; // Node currently copied to the clipboard.
  setCopiedNode: React.Dispatch<React.SetStateAction<Node | null>>; // Function to set the copied node.
  pushToHistory: () => void; // Function to save the current state to history.
  undo: () => void; // Undo the last action.
  redo: () => void; // Redo the last undone action.
  isExecuting: boolean; // Whether the workflow is currently executing.
  setReactFlowInstance: (instance: any) => void; // Set React Flow instance.
  reactFlowInstance: any; // React Flow instance.
  reactFlowWrapper: React.RefObject<HTMLDivElement>; // React Flow wrapper ref.
}

// Create the context.
const StateContext = createContext<GlobalState | undefined>(undefined);

// Hook to consume the context.
export const useGlobalState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a StateProvider");
  }
  return context;
};

// Provider component.
export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]); // State for nodes.
  const [edges, setEdges] = useState<Edge[]>([]); // State for edges.
  const [copiedNode, setCopiedNode] = useState<Node | null>(null); // State for the copied node.
  const { executeWorkflow, workflowResults, isExecuting } = useWorkflowExecution(); // Workflow execution hook.
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null); // React Flow instance state.
  const reactFlowWrapper = useRef<HTMLDivElement>(null); // React Flow wrapper ref.

  // Use the custom useHistory hook.
  const { pushToHistory, undo, redo } = useHistory(nodes, edges);

  console.log(history)

  // Function to add a new node to the flow.
  const onAddNode = useCallback(
    (type: string) => {
      if (!reactFlowInstance) {
        console.error("React Flow instance is not initialized.");
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: 600,
        y: 300,
      });
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} Node` },
      };
      setNodes((prev) => [...prev, newNode]);
      pushToHistory(nodes, edges); // Save the state to history.
    },
    [reactFlowInstance, pushToHistory]
  );

  return (
    <StateContext.Provider
      value={{
        onAddNode,
        nodes,
        setNodes,
        edges,
        setEdges,
        workflowResults,
        copiedNode,
        setCopiedNode,
        pushToHistory,
        undo,
        redo,
        isExecuting,
        setReactFlowInstance,
        reactFlowInstance,
        reactFlowWrapper,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
