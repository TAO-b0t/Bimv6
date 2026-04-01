/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ให้แน่ใจว่ามี path ไปยังไฟล์ React
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', '"Prompt"', "sans-serif"],
        serif: ['"Roboto"', '"Prompt"', "sans-serif"],
        body: ['"Roboto"', '"Prompt"', "sans-serif"],
      },
      colors: {
        primary: "#F7941D",
        "smoky-black": "#111111",
        "dark-charcoal": "#333333",
        "granite-gray": "#666666",
        "dark-jungle-green": "#091F23",
        "teal-hl": "#20424E",

        "amber-orange": "#FEA003",



        "sidebar-button": "#558A8D3B",
        "hv-sidebar-button": "#558A8D1F",
      },
    },
  },

  plugins: [],
};
