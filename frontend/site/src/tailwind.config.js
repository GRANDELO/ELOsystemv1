module.exports = {
    // ...existing configuration
    theme: {
      extend: {
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'slide-in': {
            '0%': { transform: 'translateY(-20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        animation: {
          'fade-in': 'fade-in 1s ease-out',
          'slide-in': 'slide-in 1s ease-out',
        },
      },
    },
    plugins: [],
  };
  