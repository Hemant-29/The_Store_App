/** @type {import('tailwindcss').Config} */
// Importing necessary modules using ES Module syntax 
import colors from 'tailwindcss/colors';
import lineClamp from '@tailwindcss/line-clamp'

const magnifierSVG = encodeURIComponent(`
<svg viewBox="0 0 32 32" 
  xmlns="http://www.w3.org/2000/svg" 
  fill="#ffffff" 
  width="25" 
  height="25">
  <!-- Define a filter for the shadow -->
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="black" flood-opacity="0.4" />
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <desc></desc>
    <g>
      <path d="M21,21L21,21 c1.105-1.105,2.895-1.105,4,0l5.172,5.172c0.53,0.53,0.828,1.25,0.828,2v0C31,29.734,29.734,31,28.172,31h0 c-0.75,0-1.47-0.298-2-0.828L21,25C19.895,23.895,19.895,22.105,21,21z" fill="none" stroke="#ffffff" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></path>
      <circle cx="11" cy="11" fill="none" r="10" stroke="#ffffff" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle>
      <path d="M11,5 c-3.314,0-6,2.686-6,6" fill="none" stroke="#ffffff" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></path>
      <line fill="none" stroke="#ffffff" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="18" x2="21" y1="18" y2="21"></line>
    </g>
  </g>
</svg>
`);

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extended height properties
      height: {
        '140': '35rem', // Add more custom heights as needed
      },
      // Extended width properties
      width: {
        '140': '35rem',
      },
      // Extended box shadow properties
      boxShadow: {
        'even-sm': '0 0px 6px 2px rgba(0, 0, 0, 0.1)',
        'even-md': '0 0px 6px 4px rgba(0, 0, 0, 0.1)',
      },
      // Extended keyframes properties
      keyframes: {
        growAndShrink: {
          '0%': { transform: 'scale(0)' },
          '10%, 100%': { transform: 'scale(1)' },
        },
        slide: {
          '0%': { transform: 'translateX(var(--tw-translate-start)) scale(1)' },
          '50%': { transform: 'translateX(var(--tw-translate-end)) scale(1.4)' },
          '100%': { transform: 'translateX(var(--tw-translate-end)) scale(1)' },
        },
        scaleDown: {
          '0%': { transform: 'translateX(var(--tw-translate-start)) translateY(0px) scale(1)' },
          '35%': { transform: 'translateX(var(--tw-translate-start)) translateY(-10px) scale(1.4)' },
          '100%': { transform: 'translateX(var(--tw-translate-start)) translateY(-70px) scale(0.75)' },
        }
      },
      // Extended Animation properties
      animation: {
        growAndShrink: 'growAndShrink 2s ease-in-out',
        slide: 'slide 0.5s ease-in-out forwards',
        scaleDown: 'scaleDown 0.5s ease-in-out forwards',
      },
      // Extended Cursor
      cursor: {
        'magnifier': `url("data:image/svg+xml,${magnifierSVG}") 20 20, auto`,
      },
      // Extended Colors
      colors: {
        'login-button': '#your-color-hex', // Make sure to define your color here
      },
    },
  },
  plugins: [
    lineClamp,
    // Other plugins...
  ],
}
