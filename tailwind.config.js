/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed": "#ffdad4",
        "on-tertiary-fixed-variant": "#003ea7",
        "inverse-surface": "#e4e1ee",
        "inverse-on-surface": "#302f39",
        "secondary-fixed": "#e3e2e6",
        "on-surface-variant": "#e9bcb5",
        "on-background": "#e4e1ee",
        "surface-container-low": "#1b1b24",
        "secondary": "#c7c6ca",
        "background": "#13131b",
        "on-tertiary-container": "#f4f4ff",
        "tertiary-fixed": "#dbe1ff",
        "surface": "#13131b",
        "error": "#ffb4ab",
        "on-primary": "#680200",
        "on-surface": "#e4e1ee",
        "primary-container": "#e10600",
        "on-secondary-container": "#b8b8bc",
        "surface-dim": "#13131b",
        "surface-container-high": "#292933",
        "primary": "#ffb4a8",
        "on-tertiary": "#002a77",
        "outline-variant": "#5e3f3a",
        "surface-tint": "#ffb4a8",
        "primary-fixed-dim": "#ffb4a8",
        "on-error": "#690005",
        "on-secondary": "#2f3034",
        "on-primary-fixed": "#410100",
        "tertiary": "#b4c5ff",
        "surface-container-highest": "#34343e",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "outline": "#af8781",
        "secondary-fixed-dim": "#c7c6ca",
        "inverse-primary": "#c00500",
        "surface-container": "#1f1f28",
        "tertiary-container": "#0163ff",
        "surface-bright": "#393842",
        "secondary-container": "#48494c",
        "on-tertiary-fixed": "#00174a",
        "tertiary-fixed-dim": "#b4c5ff",
        "on-primary-container": "#fff2f0",
        "surface-container-lowest": "#0d0d16",
        "on-primary-fixed-variant": "#930300",
        "on-secondary-fixed": "#1a1c1f",
        "surface-variant": "#34343e",
        "on-secondary-fixed-variant": "#46474a",
        "c-10": "#66FCF1",
        "c-30": "#1F2833",
        "c-60": "#0B0C10",
        "t-main": "#C5C6C7",
        "t-bright": "#E0E1DD"
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite'
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"]
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '42': '10.5rem',
        '50': '12.5rem',
      },
      fontSize: {
        'display': ['5rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-lg': ['7rem', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        'display-xl': ['9rem', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(102, 252, 241, 0.15)',
        'glow-md': '0 0 20px rgba(102, 252, 241, 0.25)',
        'glow-lg': '0 0 40px rgba(102, 252, 241, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(102, 252, 241, 0.08)',
        'glow-red-sm': '0 0 15px rgba(225, 6, 0, 0.3)',
        'glow-red-md': '0 0 25px rgba(225, 6, 0, 0.5)',
        'glow-red-lg': '0 0 40px rgba(225, 6, 0, 0.7)',
      },
    }
  },
  plugins: [],
}
