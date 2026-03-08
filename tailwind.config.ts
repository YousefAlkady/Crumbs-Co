import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                crumbs: {
                    pink: '#ffc0cb',
                    cream: '#FDF6E3',
                    brown: '#5C3317',
                    blue: '#00008B',
                }
            },
        },
    },
    plugins: [],
} satisfies Config;