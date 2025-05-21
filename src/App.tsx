import React from 'react'; // ✅ ADD THIS
import { Provider } from 'react-redux';
import './App.css';
import { store } from './stores/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthRoutes } from './Routes/AuthRoutes';

import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { ThemeProvider } from './Context/usecontext';

function App() {
 
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const handleSnackbarClose = () => {
    setSnackbar(null);
  };
  return (
    <ThemeProvider >
    <Provider store={store}>
     
      <BrowserRouter> {/* Ensure Router is here */}
        <AuthRoutes  setSnackBar={setSnackbar} />
        
      </BrowserRouter>
    </Provider>

     {/* Global Snackbar */}
     <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar?.severity}
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}



export default App;
