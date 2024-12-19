/** @type {import('tailwindcss').Config} */
// Export the Tailwind CSS configuration object.
export default {
    // Specify the paths to all template files where Tailwind CSS classes will be used.
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    // This enables Tailwind to perform tree-shaking (removing unused styles in production).

    theme: {
        // Extend the default Tailwind CSS theme with custom configurations.
        extend: {
            // Add custom color palette entries.
            colors: {
                'primary-green': '#08a06e', // Custom green color for primary actions.
                'primary-blue': '#4663fe', // Custom blue color for primary actions.
                'node-body': '#3b3b3b', // Background color for node components.
                paper: '#1A1A1A' // Dark gray background for general components.
            },
            // Add custom box-shadow entries.
            boxShadow: {
                'highlight-green': '0px 0px 124px 6px rgba(8, 160, 110, 0.5)',
                // Green glow effect for node selection.
                'higlight-blue': '0px 0px 124px 6px rgba(70,99,254,0.5)'
                // Blue glow effect for node selection.
            }
        }
    },

    // Add any plugins to extend Tailwind CSS functionality.
    plugins: [] // No plugins are currently included in this configuration.
};
