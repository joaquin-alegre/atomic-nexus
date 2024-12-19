import React, { useEffect } from "react";
import { NodesPanel } from "./panels/NodesPanel";
import { FlowCanvas } from "./components/FlowCanvas";
import { FooterPanel } from "./panels/FooterPanel";
import { useGlobalState } from "./context/StateContext"; // Import global state hook
import { initialNodes } from "./nodes"; // Import initial nodes
import { edgeTypes, initialEdges } from "./edges"; // Import initial edges
import { Panel, ReactFlowProvider } from "@xyflow/react";
import { ActionsPanel } from "./panels/ActionsPanel";
import '@xyflow/react/dist/style.css'; // React Flow styles.
import { useWorkflowExecution } from "./hooks/useWorkflowExecution";

export default function App() {
  const { setNodes, setEdges, workflowResults, isExecuting, undo, redo, nodes, edges, reactFlowWrapper } = useGlobalState(); // Access global state
  const { executeWorkflow } = useWorkflowExecution();

  // Load initial nodes and edges when the app loads
  useEffect(() => {
    setNodes(initialNodes); // Set initial nodes
    setEdges(initialEdges); // Set initial edges
  }, []);

  useEffect(() => {
  }, [isExecuting]);

  // Executes the workflow, iterating over nodes and their connections.
  const runWorkflow = async () => {
    const nodeExecuteFns: Record<string, (data: any) => Promise<any>> = {};
  
    nodes.forEach((node) => {
      const executeNode = node.data?.onExecute;
      if (executeNode) {
        nodeExecuteFns[node.id] = executeNode;
      }
    });
    
    const results: Record<string, any> = {};
    await executeWorkflow(
      nodes,
      edges,
      async (nodeId) => {
        const executeFn = nodeExecuteFns[nodeId];
        if (executeFn) {
          // Collect input data from incoming edges.
          const incomingEdges = edges.filter((edge) => edge.target === nodeId);
          const inputData = incomingEdges.map((edge) => results[edge.source]);
  
          // Execute the node function.
          const result = await executeFn(
            inputData.length === 1 ? inputData[0] : inputData,
            nodeExecuteFns // Pass the node execution functions for "ForEach" nodes.
          );
  
          results[nodeId] = result;
          return result;
        }
        return null;
      }
    );
  };


  return (
    <ReactFlowProvider>
      <main className="flex">
      <div className="h-[calc(100vh-40px)] w-dvw" ref={reactFlowWrapper}>
        {/* NodesPanel for adding and managing nodes */}
        <Panel position="top-left">
          <NodesPanel />
        </Panel>
      {/* Panel for workflow actions (e.g., undo, redo, run). */}
        <Panel position="top-right">
          <ActionsPanel
            undo={undo} // Undo functionality, updates nodes and edges.
            redo={redo} // Redo functionality, updates nodes and edges.
            runWorkflow={runWorkflow} // Execute the workflow.
            canUndo={true} // Enable undo if there's history.
            canRedo={true} // Enable redo if there's a redo stack.
          />
        </Panel>
        {/* FlowCanvas for visualizing the workflow */}
          <FlowCanvas />
        {/* FooterPanel for displaying workflow execution results */}
          <FooterPanel results={workflowResults} isExecuting={isExecuting} />
        </div>
      </main>
    </ReactFlowProvider>
  );
}
