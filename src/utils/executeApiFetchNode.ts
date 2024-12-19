// Interface representing a single header key-value pair.
interface Header {
    key: string; // Header name (e.g., "Authorization").
    value: string; // Header value (e.g., "Bearer token").
}

// Interface for the parameters accepted by the `executeApiFetchNode` function.
interface executeApiFetchNodeParams {
    url: string; // The base URL for the API request.
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'; // The HTTP method for the request.
    queryString: string; // Query string parameters to append to the URL.
    body?: string; // Optional request body for POST or PUT methods.
    headers: Header[]; // List of headers to include in the request.
}

/**
 * Executes an API request based on the provided parameters.
 * @param url - The base URL for the request.
 * @param method - HTTP method (GET, POST, PUT, DELETE).
 * @param queryString - Query string parameters to append to the URL.
 * @param body - (Optional) Request body for POST/PUT methods.
 * @param headers - List of headers to include in the request.
 * @returns The parsed JSON response or `null` in case of an error.
 */
export const executeApiFetchNode = async ({
    url,
    method,
    queryString,
    body,
    headers
}: executeApiFetchNodeParams): Promise<any> => {
    try {
        // Construct the full URL, appending the query string if provided.
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        // Build the fetch options object.
        const fetchOptions: RequestInit = {
            method, // Set the HTTP method.
            headers: headers.reduce((acc, header) => {
                if (header.key) acc[header.key] = header.value; // Add headers if the key is non-empty.
                return acc;
            }, {} as Record<string, string>) // Initialize as an empty object.
        };

        // Add the body for POST or PUT requests, if provided.
        if (['POST', 'PUT'].includes(method) && body) {
            fetchOptions.body = body;
        }

        // Make the API request using the Fetch API.
        const response = await fetch(fullUrl, fetchOptions);

        // Parse the JSON response.
        const data = await response.json();

        return data; // Return the parsed response.
    } catch (error) {
        // Log the error and return null if the request fails.
        console.error('API Fetch error:', error);
        return null;
    }
};
