/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: 'hsl(var(--color-primary-100) / <alpha-value>)',
          200: 'hsl(var(--color-primary-200) / <alpha-value>)',
          300: 'hsl(var(--color-primary-300) / <alpha-value>)',
          400: 'hsl(var(--color-primary-400) / <alpha-value>)',
          500: 'hsl(var(--color-primary-500) / <alpha-value>)',
          600: 'hsl(var(--color-primary-600) / <alpha-value>)',
          700: 'hsl(var(--color-primary-700) / <alpha-value>)',
        },
        neutral: {
          100: 'hsl(0, 0%, 97%)',
          200: 'hsl(0, 0%, 90%)',
          300: 'hsl(0, 0%, 70%)',
          400: 'hsl(0, 0%, 50%)',
          500: 'hsl(0, 0%, 30%)',
          600: 'hsl(0, 0%, 15%)',
          700: 'hsl(0, 0%, 5%)',
        },
      },
      spacing: {
        '100': '4px',
        '200': '8px',
        '300': '16px',
        '400': '24px',
        '500': '32px',
        '600': '48px',
        '700': '64px',
        '800': '96px',
      },
      borderRadius: {
        'squircle': '28%',
        'squircle-sm': '20%',
        'pill': '999px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'md': '1rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3.5rem',
      },
      lineHeight: {
        'tight': '1.2',
        'body': '1.6',
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'bold': '700',
      },
      screens: {
        'xs': '0px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
