# Atomic Nexus - Workflow Builder (Test Project)

![Alt text](https://i.postimg.cc/XY2FrzTX/Atomic.png)

## Project Description

The Atomic Nexus - Workflow Builder is a visual tool developed by Joaquin Alegre
using **Vite**, **TypeScript**, **React**, **ReactFlow**, and **Tailwind CSS**.
This project was completed in **3 days** as part of a technical challenge for a
job application.

The project reflects a solid effort in understanding and utilizing tools like
ReactFlow to manage workflows, nodes, and edges. It demonstrates key concepts of
user interface design, workflow logic, and component-based architecture. While
there are opportunities for improvement, the current implementation provides a
clear foundation for managing workflows and highlights the ability to work
efficiently with new tools and libraries.

Additionally, the **look and feel** of the application was inspired by the
branding and visual design of **Deskree**, ensuring alignment with their style
and identity.

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Custom Nodes](#custom-nodes)
4. [Action Panel](#action-panel)
5. [Panels Overview](#panels-overview)
6. [Node and Edge Management](#node-and-edge-management)
7. [Workflow Management](#workflow-management)
8. [Validations](#validations)
9. [Responsive Design](#responsive-design)
10. [Code Structure](#code-structure)
11. [Usage Examples](#usage-examples)
12. [Considerations and Future Improvements](#considerations-and-future-improvements)
13. [Contributing](#contributing)

---

## Technologies Used

This project leverages the following technologies:

-   **Vite**: For fast project scaffolding and efficient development.
-   **TypeScript**: To ensure type safety and a better development experience.
-   **React**: A powerful library for building user interfaces.
-   **ReactFlow**: For creating interactive and customizable workflows.
-   **Tailwind CSS**: For rapid UI development with a clean and consistent
    design.

---

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/joaquin-alegre/atomic-nexus.git
    ```
2. Navigate to the project directory:
    ```bash
    cd atomic-nexus
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

---

## Custom Nodes

The project includes two custom node types:

### API Fetch Node

This node is designed for making HTTP requests. It includes the following
configurable fields:

-   **URL**: The endpoint for the API request.
-   **Method**: Select the HTTP method (GET, POST, PUT, DELETE, etc.).
-   **Query Params**: Configure query parameters.
-   **Body** (Dynamic): Input for the request body, formatted as JSON.
-   **Headers** (Dynamic): Add Key-Value pairs for request headers.

The **headers** and **body** inputs are displayed dynamically based on the
user's configuration, ensuring flexibility while maintaining a clean interface.

### ForEach Node

This node is used for iterating over arrays. Key features include:

-   **ArrayPropertyName**: Specifies the property in the array to iterate over.
-   **Multiple Outputs**: The node can have multiple outputs to handle branching
    logic.
-   **Single Return**: Ensures only one return path to maintain workflow
    consistency.

### Node Structure

-   **Header**: Displays the node type and its unique ID.
-   **Body**: Contains dynamic inputs and settings based on the node type.
-   **Actions**:
    -   **Copy**: Copies the node to the clipboard.
    -   **Delete**: Removes the node from the canvas.
    -   **Paste**: Places a previously copied node into the canvas.

---

## Panels Overview

## Action Panel

The Action Panel, located in the top-right corner, includes the following
functionalities:

1. **Undo**: Reverts the last action performed on the canvas.
2. **Redo**: Restores the most recently undone action.
3. **Save Workflow**:
    - Exports all nodes, edges, and configurations into a JSON file
      (`workflow.json`).
    - Includes all input values defined in the nodes.
4. **Load Workflow**:
    - Rebuilds a workflow from a previously saved JSON file.
    - Example workflows are available in the `/examples` directory.
5. **Run Workflow**:
    - Processes the defined workflow based on the connected nodes.
    - Executes logic in sequence or branches, as defined by the connections.

### Add Nodes Panel

Located in the top-left corner, this panel includes:

-   A button labeled **"Add Nodes"**.
-   On **desktop**, clicking the button opens a draggable menu with available
    nodes.
-   On **mobile**, clicking the button opens a modal where nodes can be selected
    and added directly to the canvas.

### Footer Panel

Located at the bottom of the interface, this panel provides:

-   **Right Side**:
    -   **Zoom Buttons**: For zooming in and out of the canvas.
-   **Left Side**:
    -   **Console Button**: Opens a console panel to monitor and view the
        workflow execution output.

---

## Node and Edge Management

### Adding Nodes

-   **Desktop**:
    -   Nodes can be dragged and dropped from the "Add Nodes" menu.
-   **Mobile**:
    -   Nodes are added directly from a modal.

### Custom Edges

-   **Desktop**:
    -   A delete button appears when hovering over or selecting an edge.
-   **Mobile**:
    -   The delete button remains visible for selected edges.
-   **Functionality**:
    -   Custom edges support deletion and reconfiguration via user interaction.

---

## Workflow Management

Several reusable hooks were implemented to manage workflows effectively:

-   `useCopyPaste`: Handles copying and pasting nodes.
-   `useDragAndDrop`: Manages the drag-and-drop functionality for nodes.
-   `useHistory`: Tracks undo/redo actions.
-   `useWorkflowExecution`: Executes workflows based on connected nodes and
    configurations.

---

## Validations

The application includes the following validations to ensure consistency:

1. **Single Source Per Input**: Each input socket can only have one source
   connection.
2. **ForEach Node Outputs**: Can have multiple outputs but only one return path.

---

## Responsive Design

The interface is fully responsive:

-   **Desktop**:
    -   Enhanced drag-and-drop functionality for nodes.
-   **Mobile**:
    -   Mobile-friendly menus, modals, and touch-based interactions.
    -   Adjustments for canvas interaction, such as creating and managing edges.

---

## Code Structure

```plaintext
src/
├── components/
│   ├── IconButton.tsx         # Reusable button with tooltips
│   ├── templates/             # Templates for reusable elements
│       ├── NodeTemplate.tsx
│       └── AddNodeTemplate.tsx
├── edges/                     # Custom edges definition
├── hooks/                     # Reusable hooks
├── nodes/                     # Node definitions
├── panels/                    # Panels (Add Nodes, Action Panel, Footer Panel)
├── examples/                  # Examples to load (in JSON)
└── App.tsx                    # Main application file
```

---

## Usage Examples

1. **Creating a Workflow**:

    - Drag and drop nodes onto the canvas.
    - Connect nodes and configure their inputs.

2. **Saving and Loading Workflows**:

    - Save workflows to JSON files and reload them later.

3. **Executing Workflows**:
    - Run workflows and view outputs in the console panel.

---

## Considerations and Future Improvements

### Decisions Made

1. **Replacing Sidebar with Menu**:

    - Initially implemented as a sidebar, the node menu was replaced with a
      **"Add Nodes"** button to maximize canvas space.

2. **Keyboard Shortcuts**:

    - Added support for `Ctrl+C`/`Cmd+C` for node copying and `Ctrl+V`/`Cmd+V`
      for pasting. These shortcuts are not yet integrated into the undo/redo
      history but provide quick duplication. Copying and pasting using the node
      header ensures the content is reliably saved to the clipboard.

3. **Footer Panel**:

    - Introduced to provide essential canvas controls (zoom) and monitor
      workflow execution (console panel).

4. **State Management**:
    - The application currently uses **React Hooks** like `useState` and
      `useEffect` to manage nodes, edges, and other key data.

### Future Improvements

1. **Enhanced Interaction Between Nodes**:

    - During testing, a feature was explored to add an additional input to the
      **API Fetch Node** when it is preceded by a **ForEach Node**. This input
      would allow each item of the array being iterated by the ForEach Node to
      be utilized as a parameter for the API Fetch execution.
    - For this, a **Select Input** named `UseDataAs` was prototyped. This input
      would let users select how the array item should be used:
        - As **query parameters**.
        - As part of the **JSON body**.
    - This functionality would significantly enhance the scalability and
      versatility of workflows involving these two nodes.

2. **Expanded Node Library**:

    - Adding more node types (e.g., conditional nodes, transformation nodes) to
      support complex workflows.

3. **Error Handling**:

    - Improved error messages and visual indicators for better debugging.

4. **Node Templates**:

    - Support for creating and saving custom node templates for repeated use.

5. **Centralized State Management**:

    - For a project of this scale, leveraging a state management library such as
      **Redux** or **Context API** would be very beneficial to centralize state
      management and simplify data handling across components. There is another
      branch in the project, named **`feat/context-api`**, which is being
      developed in parallel as a work-in-progress solution using  
      **Context API** to centralize state management.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to
suggest improvements or report bugs.
