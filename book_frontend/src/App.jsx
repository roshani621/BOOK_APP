import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Dashboard from './Pages/dashboard/Dashboard';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;