import { useMemo, useState, useRef, useCallback } from 'react';
import {
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  Panel,
} from '@xyflow/react'; // React Flow hooks and utilities.
import '@xyflow/react/dist/style.css'; // React Flow styles.
import { FlowCanvas } from './components/FlowCanvas'; // Main canvas for the flow editor.

import { initialNodes, nodeTypes } from './nodes'; // Initial nodes and custom node types.
import { initialEdges } from './edges'; // Initial edges.
import { NodesPanel } from './panels/NodesPanel'; // Panel for adding new nodes.
import { useHistory } from './hooks/useHistory'; // Custom hook for undo/redo functionality.
import { useDragAndDrop } from './hooks/useDragAndDrop'; // Custom hook for drag-and-drop support.
import { useWorkflowExecution } from './hooks/useWorkflowExecution'; // Custom hook for workflow execution logic.
import { FooterPanel } from './panels/FooterPanel'; // Panel for displaying execution results and controls.
import { validateConnection } from './utils/validateConnections'; // Utility function to validate edge connections.
import { CustomDeletableEdge, CustomDeletableEdgeProps } from './edges/CustomDeletableEdge'; // Custom edge component.
import { JSX } from 'react/jsx-runtime'; // JSX runtime for type safety.

export default function App() {
  // Reference for the React Flow container.
  const reactFlowWrapper = useRef(null);

  // React Flow state management.
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // Hooks for workflow execution, history management, and drag-and-drop functionality.
  const { executeWorkflow, workflowResults, isExecuting } = useWorkflowExecution();
  const { pushToHistory, undo, redo, history, redoStack } = useHistory(nodes, edges);
  const { onDragOver, onDrop } = useDragAndDrop({
    reactFlowWrapper,
    reactFlowInstance,
    setNodes,
    getNodes: () => nodes,
    getEdges: () => edges,
    pushToHistory,
  });

  // Deletes an edge by ID.
  const handleDeleteEdge = useCallback(
    (id: string) => setEdges((eds) => eds.filter((edge) => edge.id !== id)),
    [setEdges]
  );

  // Custom edge types with delete functionality.
  const edgeTypes = useMemo(
    () => ({
      custom: (props: JSX.IntrinsicAttributes & CustomDeletableEdgeProps) => (
        <CustomDeletableEdge {...props} onDelete={handleDeleteEdge} pushToHistory={pushToHistory} />
      ),
    }),
    []
  );

  // Updates the data of a specific node.
  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  };

  // Handles connecting two nodes with an edge.
  const onConnect = useCallback(
    (connection: any) => {
      if (!validateConnection(connection, edges, nodes)) {
        console.error('Invalid connection', connection);
        return;
      }
      pushToHistory(nodes, edges);
      setEdges((eds) => addEdge({ ...connection, type: 'custom' }, eds));
    },
    [nodes, edges, pushToHistory, setEdges]
  );

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

  // Adds a new node of the specified type.
  const onAddNode = (type: any) => {
    const position = reactFlowInstance?.screenToFlowPosition({ x: 600, y: 300 });
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: `${type} Node` },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <ReactFlowProvider>
      <main className="flex">
        {/* Nodes panel for adding new nodes */}
        <Panel>
          <NodesPanel onAddNode={onAddNode} />
        </Panel>
        
        {/* Main Flow Canvas */}
        <div className="h-[calc(100vh-40px)] w-dvw" ref={reactFlowWrapper}>
          <FlowCanvas
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                updateNodeData,
                pushToHistory,
              },
            }))}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
            onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            runWorkflow={runWorkflow}
            setReactFlowInstance={setReactFlowInstance}
            updateNodeData={updateNodeData}
            pushToHistory={pushToHistory}
            undo={undo}
            redo={redo}
            setNodes={setNodes}
            setEdges={setEdges}
            history={history}
            redoStack={redoStack}
          />
        </div>
        
        {/* Footer panel for workflow execution results */}
        <FooterPanel results={workflowResults} isExecuting={isExecuting} />
      </main>
    </ReactFlowProvider>
  );
}
