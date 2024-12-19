import React, { useState, useRef } from 'react';
import { FiPackage, FiCpu, FiX, FiPlus } from "react-icons/fi"; // Icons for the UI.
import { AddNodeTemplate } from '../components/templates/AddNodeTemplate'; // Reusable template for node cards.
import { useGlobalState } from '../context/StateContext'; // Import global state hook.

export const NodesPanel: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Tracks if the desktop menu is open.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Tracks if the mobile menu is open.
  const menuRef = useRef<HTMLDivElement | null>(null); // Reference to the menu container.

  const { onAddNode } = useGlobalState(); // Access the global state function for adding nodes.

  // Toggle the desktop menu visibility.
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Toggle the mobile menu visibility.
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Handle drag-and-drop for desktop menu nodes.
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType); // Set the node type for drag-and-drop.
    event.dataTransfer.effectAllowed = 'move'; // Indicate the type of drag action.
  };

  // Handle adding a node in mobile menu mode.
  const handleAddNode = (type: string) => {
    onAddNode(type); // Use the global state function to add a node.
    setIsMobileMenuOpen(false); // Close the mobile menu.
  };

  return (
    <div className="relative inline-block m-2">
      {/* Primary Button for Desktop */}
      <button
        onClick={toggleMenu}
        className="hidden md:flex items-center justify-center p-2 rounded-lg text-white bg-paper hover:bg-[#333333]"
      >
        <div className="flex justify-center items-center gap-2 px-2 text-sm">
          <FiPlus /> Add node
        </div>
      </button>

      {/* Primary Button for Mobile */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden flex items-center justify-center p-2 rounded-lg text-white bg-paper hover:bg-[#333333]"
      >
        <div className="flex justify-center items-center gap-2 px-2 text-sm">
          <FiPlus /> Add node
        </div>
      </button>

      {/* Desktop Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute z-10 bg-paper rounded-md w-80 -mt-9 text-white hidden md:block">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-center cursor-default text-gray-300">
                Choose and drag a node to add it
              </p>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full text-white">
                <FiX size={20} />
              </button>
            </div>
            {/* API Fetch Node */}
            <AddNodeTemplate
              title="API Fetch Node"
              subtitle="Simulates an API request."
              icon={<FiPackage size={30} />}
              onDragStart={(event) => handleDragStart(event, "ApiFetch")}
              backgroundColor="bg-[#08a06e]"
            />
            {/* For Each Node */}
            <AddNodeTemplate
              title="For Each Node"
              subtitle="Loops through an array and executes connected nodes sequentially."
              icon={<FiCpu size={30} />}
              onDragStart={(event) => handleDragStart(event, "ForEach")}
              backgroundColor="bg-primary-blue"
            />
          </div>
        </div>
      )}

      {/* Mobile Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-75 md:hidden">
          <div className="bg-paper rounded-md w-4/5 p-4 text-white space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-center cursor-default text-gray-300">
                Select a node to add it
              </p>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-full text-white">
                <FiX size={20} />
              </button>
            </div>
            {/* Add API Fetch Node */}
            <div onClick={() => handleAddNode("ApiFetch")}>
              <AddNodeTemplate
                title="API Fetch Node"
                subtitle="Simulates an API request."
                icon={<FiPackage size={30} />}
                backgroundColor="bg-[#08a06e]"
                onDragStart={() => undefined} // Drag is not needed in mobile mode.
              />
            </div>
            {/* Add For Each Node */}
            <div onClick={() => handleAddNode("ForEach")}>
              <AddNodeTemplate
                title="For Each Node"
                subtitle="Loops through an array and executes connected nodes sequentially."
                icon={<FiCpu size={30} />}
                backgroundColor="bg-primary-blue"
                onDragStart={() => undefined} // Drag is not needed in mobile mode.
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
