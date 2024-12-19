// Variable to store the copied node. It is initialized as `null`.
let copiedNode: any = null;

/**
 * Function to set the copied node.
 * @param node - The node object to be stored in the clipboard.
 */
export const setCopiedNode = (node: any) => {
    copiedNode = node; // Store the provided node in the `copiedNode` variable.
};

/**
 * Function to retrieve the copied node.
 * @returns The node currently stored in the clipboard.
 */
export const getCopiedNode = () => copiedNode; // Return the value of `copiedNode`.
