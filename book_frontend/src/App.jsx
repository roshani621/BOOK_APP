import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Dashboard from './Pages/dashboard/Dashboard';
import AddBook from './Pages/Admin/AddBook';
import UpdateBook from './Pages/Admin/UpdateBook';
import ViewBooks from './Pages/Users/ViewBooks';
import BorrowRequest from './Pages/Admin/BorrowRequest';
import RequestRecords from './Pages/Admin/RequestRecords';
import BorrowHistory from './Pages/Users/BorrowHistory';
import MyBorrowBook from './Pages/Users/MyBorrowBook';
import Profile from './Components/Profile';
import Notification from './Components/Notification';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/add-book' element={<AddBook/>}/>
          <Route path='/manage-books' element={<UpdateBook/>}/>
          <Route path='/books' element={<ViewBooks />}/>
          <Route path='/borrow-requests' element={<BorrowRequest/>}/>
          <Route path='/borrow-records' element={<RequestRecords/>}/>
          <Route path='/borrow-history' element={<BorrowHistory/>}/>
          <Route path='/my-books' element={<MyBorrowBook/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/notification' element={<Notification />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;