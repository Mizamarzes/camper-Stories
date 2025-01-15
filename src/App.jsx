import React from 'react';
import AppRouter from './router/AppRouter';
import { ToastContainer, Bounce } from 'react-toastify';
import FloatingActionMenu from './components/FloatingMenu/FloatingActionMenu'; // Asegúrate de que la ruta sea correcta
import './styles/variables.css';
import './styles/base.css';

function App() {
  return (
    <div className="App">
      <AppRouter />
      <FloatingActionMenu />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
