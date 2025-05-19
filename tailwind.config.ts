module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
    theme: {
        extend: {
            keyframes: {
                'slide-down': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: {
                'slide-down': 'slide-down 0.3s ease-out forwards',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
    variants: {
        scrollbar: ['rounded']
    }
};