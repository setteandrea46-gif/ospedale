import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        medblue: '#dff3f0',
        medaccent: '#0f766e',
        medink: '#102a43',
        medwarm: '#f4eee7',
        meddanger: '#b42318'
      }
    }
  },
  plugins: [forms]
};
