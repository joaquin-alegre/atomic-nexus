import React, { useEffect, useState, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { FiZoomIn, FiZoomOut, FiMaximize, FiTerminal, FiX } from "react-icons/fi";
import { FaChevronDown, FaChevronUp, FaCheckCircle } from "react-icons/fa";
import { useGlobalState } from "../context/StateContext"; // Import the global state hook

export const FooterPanel: React.FC = () => {
  const { workflowResults: results, isExecuting } = useGlobalState(); // Access workflow results and execution state
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow(); // React Flow zoom actions
  const [zoomLevel, setZoomLevel] = useState<number>(100); // Current zoom level as a percentage
  const [isConsoleOpen, setIsConsoleOpen] = useState(false); // Whether the console is open
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({}); // Tracks expanded result details

  const scrollContainerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

  // Toggle the visibility of the console panel
  const toggleConsole = () => setIsConsoleOpen((prev) => !prev);

  // Toggle the visibility of details for a specific node's result
  const toggleDetails = (nodeId: string) => {
    setOpenDetails((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Open the console panel automatically when execution starts
  useEffect(() => {
    if (isExecuting) {
      setIsConsoleOpen(true);
    }
  }, [isExecuting]);

  // Update zoom level periodically by querying the React Flow instance
  useEffect(() => {
    const handleZoomChange = () => setZoomLevel(Math.round(getZoom() * 100));
    const zoomInterval = setInterval(handleZoomChange, 200); // Update every 200ms
    return () => clearInterval(zoomInterval); // Cleanup interval on unmount
  }, [getZoom]);

  return (
    <>
      {isConsoleOpen && (
        <div className="bg-[#00000080] fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-paper md:w-2/3 w-full md:h-2/3 h-full md:p-8 p-6 md:rounded-md rounded-none flex flex-col">
            {/* Console Header */}
            <div className="flex text-lg justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-white flex gap-3 items-center">
                <div className="w-7 h-7 flex justify-center items-center">
                  {isExecuting ? (
                    <svg
                      aria-hidden="true"
                      className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    <FaCheckCircle size={23} className="text-neutral-400" />
                  )}
                </div>
                {isExecuting ? "Executing workflow..." : "Workflow results:"}
              </h3>
              <button className="text-white" onClick={toggleConsole}>
                <FiX size={25} />
              </button>
            </div>

            {/* Workflow Results */}
            <div ref={scrollContainerRef} className="overflow-y-scroll flex-grow space-y-4">
              {Object.keys(results).length > 0 || isExecuting ? (
                Object.entries(results).map(([nodeId, result]) => (
                  <div key={nodeId} className="text-white rounded">
                    <div
                      className={`cursor-pointer text-md font-bold p-6 rounded-md flex justify-between items-center ${result?.type === "ApiFetch" ? "bg-[#08a06e]" : "bg-primary-blue"}`}
                      onClick={() => toggleDetails(nodeId)}
                    >
                      <span>
                        {result?.type === "ApiFetch" ? "API Fetch Node: " : "For Each Node: "}
                        {`${result?.nodeId}`}
                      </span>
                      <span>
                        {openDetails[nodeId] ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>
                    {openDetails[nodeId] && (
                      <pre className="mt-4 bg-[#3b3b3b] p-8 rounded text-gray-300 text-sm overflow-auto">
                        {JSON.stringify(result?.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full bg-[#3b3b3b] rounded">
                  <p className="text-gray-300 text-center">No results to display.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Panel */}
      <div className="fixed bottom-0 w-full bg-[#1A1A1A] text-white border-t-2 border-[#212121]">
        <div className="flex gap-2 justify-between items-center p-2 px-4">
          <button className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded" onClick={toggleConsole}>
            <FiTerminal size={16} />
            <span className="text-sm">Console</span>
          </button>
          <div className="flex gap-3 items-center">
            {/* Fit View Button */}
            <button onClick={fitView} className="p-1 hover:bg-gray-700 rounded" title="Fit View">
              <FiMaximize size={16} />
            </button>
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button onClick={zoomOut} className="p-1 hover:bg-gray-700 rounded" title="Zoom Out">
                <FiZoomOut size={16} />
              </button>
              <div className="text-sm font-semibold px-1 cursor-default w-12 text-center">{zoomLevel}%</div>
              <button onClick={zoomIn} className="p-1 hover:bg-gray-700 rounded" title="Zoom In">
                <FiZoomIn size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
