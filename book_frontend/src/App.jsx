import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './Pages/dashboard/Dashboard';
import Add_Book from './Pages/Admin_Books/Add_Book';
import ViewBook from './Pages/Users/ViewBook';
import MyBorrowBook from './Pages/Users/MyBorrowBook';
import BorrowRequest from './Pages/Admin_Books/BorrowRequest';
import BorrowRecords from './Pages/Admin_Books/BorrowRecords';
import MyBorrowHistory from './Pages/Users/MyBorrowHistory';
import ReturnBook from './Pages/Users/ReturnBook';
import UpdateBook from './Pages/Admin_Books/UpdateBook';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/add-book' element={<Add_Book/>}/>
          <Route path='/books' element={<ViewBook/>}/>
          <Route path='/my-books' element={<MyBorrowBook/>}/>
          <Route path='/borrow-requests' element={<BorrowRequest/>}/>
          <Route path='/borrow-records' element={<BorrowRecords/>}/>
          <Route path='/borrow-history' element={<MyBorrowHistory/>}/>
          <Route path='/return-book' element={<ReturnBook/>}/>
          <Route path='/manage-books' element={<UpdateBook/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;