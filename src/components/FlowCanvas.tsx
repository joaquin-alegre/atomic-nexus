import React, {useMemo, useCallback} from 'react';
import {
  addEdge,
  ReactFlow,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react'; // Import React Flow components and types.
import { useGlobalState } from '../context/StateContext'; // Import global state hook.
import { CustomDeletableEdge, CustomDeletableEdgeProps } from '../edges/CustomDeletableEdge';
import { validateConnection } from '../utils/validateConnections';
import { nodeTypes } from '../nodes';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

export const FlowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    setReactFlowInstance,
    pushToHistory
  } = useGlobalState(); // Access global state and handlers.

  const { onDragOver, onDrop } = useDragAndDrop();

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

  return (
    <ReactFlow
      // Pass the list of nodes and edges from global state.
      nodes={nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          updateNodeData,
          pushToHistory,
        },
      }))}
      edges={edges}
      // Register custom node and edge types from global state.
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      // Register event callbacks for nodes, edges, and connections.
      onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
      onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
      onConnect={onConnect}
      // Callbacks for drag-and-drop interactions on the canvas.
      onDragOver={onDragOver}
      onDrop={onDrop}
      // Initialize React Flow instance with the provided callback.
      onInit={setReactFlowInstance}
      // Enable snapping to a grid for better alignment.
      snapToGrid={true}
      // Automatically fit the view to the current nodes and edges.
      fitView
      // Limit the maximum zoom level when fitting the view.
      fitViewOptions={{ maxZoom: 1 }}
    >
      {/* Add a background with a dotted pattern for visual clarity. */}
      <Background gap={25} color="#3A3A3A" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
};
