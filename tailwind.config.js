/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#09617c',
                'primary-dark': '#074a5f',
                'primary-light': '#e0eff4',
                'background-light': '#f6f8f8',
                'background-dark': '#101e22',
                'surface-light': '#ffffff',
                'surface-dark': '#182c33',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.5rem',
                lg: '1rem',
                xl: '1.5rem',
            },
        },
    },
    plugins: [],
}
