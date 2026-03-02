import { Button, Card, Col, Input, Row, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';

const {Text, Title} = Typography;
const { Search } = Input;
const ViewBook = () => {

    const [books, setBooks] = useState([]);
    const [borrow_days, setBorrow_days] = useState({});

    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const openDrawer = () =>{
        setDrawerOpen(true);
    }
    
    const closeDrawer = () =>{
        setDrawerOpen(false);
    }

    const fetchBooks = async() =>{
        try{
            const res = await axios.get("http://127.0.0.1:5000/books");
            setBooks(res.data.books);

        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchBooks();
    },[]);

    const handleBorrowRequest =async(bookId)=>{
        try{
            if(!borrow_days){
                alert("Please enter borrow days");
                return;
            }
            const userId = localStorage.getItem("b_user_id");
            const payload = {
                user_id: userId,
                book_id: bookId,
                borrow_days: borrow_days
            };
            console.log(payload)
            const res = await axios.post("http://127.0.0.1:5000/book-request", payload);
            alert(res.data.message);
        } catch(err){
            alert("Failed to send borrow request", err);
        }
    }
    return (
        <div>
            <Navtab onMenuClick={openDrawer}/>
            <Sidebar open={drawerOpen} onClose={closeDrawer}/>
            <div>
                <Search placeholder='serach books here'
                style={{
                    width: '450px',
                    margin: '30px',
                    padding: '10px',
                    marginLeft: '290px'
                }}
                />
            </div>
            <Row>
                <Col>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '20px',
                        flexWrap: 'wrap', justifyContent:'center'
                    }}>
                        {books.map((book)=>(
                            <Card key={book._id} hoverable>
                                <Title level={5}>Title: <Text>{book.title}</Text></Title>
                                <Title level={5}>Author: <Text>{book.author}</Text></Title>
                                <Title level={5}>category: <Text>{book.category}</Text></Title>
                                <Title level={5}>ISBN Number: <Text>{book.isbn}</Text></Title>
                                <Title level={5}>Total Copies: <Text>{book.total_copies}</Text></Title>
                                <Title level={5}>Availabel Copies: <Text>{book.available_copies}</Text></Title>
                                <Title level={5}>Created Date: <Text>{book.created_at}</Text></Title>
                                <Title level={5}>Borrow Days</Title>
                                <Input placeholder='enter borrow days' 
                                value={borrow_days[book._id] || ""} 
                                onChange={(e)=>{
                                    setBorrow_days({
                                            ...borrow_days,
                                            [book._id]: e.target.value
                                        })
                                }}
                                /><br/><br/>
                                <Button htmlType='submit' variant='solid'
                                color='danger' style={{
                                    margin: '10px'
                                }} onClick={()=>{handleBorrowRequest(book._id)}}
                                >Borrow Request</Button>
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ViewBook;