import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import Preloader from './components/Preloader.jsx';
import './index.css';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? <Preloader onFinished={() => setIsLoading(false)} /> : <App />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  </React.StrictMode>
);