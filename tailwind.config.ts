import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          dark: '#1A1A1A',
          light: '#333333',
        },
        light: {
          DEFAULT: '#FAFAFA',
          darker: '#F5F5F5',
          card: '#FFFFFF',
        },
        accent: {
          gray: '#6B7280',
          dark: '#374151',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top, #0A0A0A 0%, #000000 100%)',
        'dark-gradient': 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
        'white-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #E5E5E5 100%)',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 255, 0.1)',
        'glow-hover': '0 0 25px rgba(255, 255, 255, 0.15)',
        'white': '0 4px 15px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
