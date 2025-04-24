import { Provider } from 'react-redux';
import './App.css';
import { store } from './stores/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthRoutes } from './Routes/AuthRoutes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter> {/* Ensure Router is here */}
        <AuthRoutes />
        
      </BrowserRouter>
    </Provider>
  );
}

export default App;
