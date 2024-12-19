import React from "react";

// Define the properties (props) that the component expects.
// This interface specifies the structure of the AddNodeTemplateProps.
interface AddNodeTemplateProps {
  title: string; // The title to display in the node template.
  subtitle: string; // The subtitle to display below the title.
  icon: React.ReactNode; // A React node representing the icon to display (e.g., an SVG or JSX element).
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void | undefined; // A function triggered when the node is dragged.
  backgroundColor: string; // A string defining the background color (likely a CSS class name).
}

// Create a functional React component using TypeScript.
// This component renders a draggable UI element that represents a node template.
export const AddNodeTemplate: React.FC<AddNodeTemplateProps> = ({
  title,
  subtitle,
  icon,
  onDragStart,
  backgroundColor,
}) => {
  return (
    <div
      // Apply dynamic CSS classes for styling, including backgroundColor passed as a prop.
      className={`h-16 flex p-2 px-4 items-center gap-3 rounded-md shadow cursor-pointer ${backgroundColor}`}
      
      // Attach the onDragStart event handler to make the element draggable.
      onDragStart={onDragStart}
      
      // Enable the draggable functionality for this element.
      draggable
    >
      {/* Render the icon inside a span with a fixed width for alignment */}
      <span className="w-7">{icon}</span>

      {/* Render the title and subtitle inside a div */}
      <div>
        <p className="font-semibold">{title}</p> {/* Display the title in bold */}
        <p className="text-xs">{subtitle}</p> {/* Display the subtitle with smaller text */}
      </div>
    </div>
  );
};
