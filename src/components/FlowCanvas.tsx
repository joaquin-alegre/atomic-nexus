import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react'; // Import React Flow components and types.

import { ActionsPanel } from '../panels/ActionsPanel'; // Custom actions panel for workflow controls.

interface FlowCanvasProps {
  nodes: Node[]; // List of nodes in the flow.
  edges: Edge[]; // List of edges (connections) between nodes.
  nodeTypes: Record<string, React.ComponentType<any>>; // Custom node types mapped to their components.
  edgeTypes: Record<string, React.ComponentType<any>>; // Custom edge types mapped to their components.
  onNodesChange: OnNodesChange; // Callback for when nodes are added, removed, or updated.
  onEdgesChange: OnEdgesChange; // Callback for when edges are added, removed, or updated.
  onConnect: OnConnect; // Callback for creating new connections between nodes.
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void; // Callback for handling drag-over events on the canvas.
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void; // Callback for handling drop events on the canvas.
  runWorkflow: () => Promise<void>; // Function to execute the workflow logic.
  setReactFlowInstance: (instance: any) => void; // Callback to initialize the React Flow instance.
  updateNodeData: (nodeId: string, newData: any) => void; // Function to update the data of a specific node.
  undo: (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) => void; // Function to undo the last action.
  redo: (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) => void; // Function to redo the last undone action.
  history: { nodes: Node[]; edges: Edge[] }[]; // Array representing the history of states for undo functionality.
  redoStack: { nodes: Node[]; edges: Edge[] }[]; // Array representing redo states.
  setEdges: (edges: Edge[]) => void; // Setter to update edges in the flow.
  setNodes: (nodes: Node[]) => void; // Setter to update nodes in the flow.
}

// Functional component representing the React Flow canvas.
export const FlowCanvas = ({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDragOver,
  onDrop,
  runWorkflow,
  setReactFlowInstance,
  undo,
  redo,
  history,
  redoStack,
  setEdges,
  setNodes,
}: FlowCanvasProps) => (
  <ReactFlow
    // Pass the list of nodes and edges to React Flow.
    nodes={nodes}
    edges={edges}
    // Register custom node and edge types.
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    // Register event callbacks for nodes, edges, and connections.
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
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

    {/* Panel for workflow actions (e.g., undo, redo, run). */}
    <Panel position="top-right">
      <ActionsPanel
        undo={() => undo(setNodes, setEdges)} // Undo functionality, updates nodes and edges.
        redo={() => redo(setNodes, setEdges)} // Redo functionality, updates nodes and edges.
        runWorkflow={runWorkflow} // Execute the workflow.
        canUndo={history.length > 1} // Enable undo if there's history.
        canRedo={redoStack.length > 0} // Enable redo if there's a redo stack.
      />
    </Panel>
  </ReactFlow>
);
