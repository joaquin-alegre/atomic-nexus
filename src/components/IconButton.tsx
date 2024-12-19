import React from 'react';

// Define the properties (props) that the IconButton component expects.
interface IconButtonProps {
  onClick: () => void; // Function to be called when the button is clicked.
  disabled?: boolean; // Optional flag to disable the button.
  tooltip: string; // Text to display in the tooltip.
  icon: React.ReactNode; // Icon to render inside the button (e.g., SVG or JSX element).
  className?: string; // Optional additional CSS classes for styling.
}

// Functional component for a reusable icon button with a tooltip.
export const IconButton: React.FC<IconButtonProps> = ({ onClick, disabled, tooltip, icon, className }) => (
  <button
    // Attach the click handler function.
    onClick={onClick}
    // Apply the disabled property to the button.
    disabled={disabled}
    // Add dynamic CSS classes for styling, including hover and disabled states.
    className={`relative group p-2 rounded text-white bg-paper hover:bg-[#333333] disabled:opacity-50 disabled:cursor-default ${className}`}
  >
    {/* Render the icon passed as a prop. */}
    {icon}

    {/* Tooltip container, visible on hover using the group-hover utility. */}
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block px-2 py-1 bg-paper text-white text-xs rounded shadow-lg">
      {tooltip} {/* Display the tooltip text passed as a prop. */}
    </div>
  </button>
);
