import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;