import { Button, Card, Col, Input, Row, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';

const {Text, Title} = Typography;
const { Search } = Input;
const BorrowRequest = () => {

    const [books, setBooks] = useState([]);

    const [remark, setRemark] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const openDrawer = () =>{
        setDrawerOpen(true);
    }
    
    const closeDrawer = () =>{
        setDrawerOpen(false);
    }

    const user_id = localStorage.getItem("b_user_id");
    console.log(user_id)
    const fetchBooks = async() =>{
        try{
            const res = await axios.get("http://127.0.0.1:5000/my-books");
            setBooks(res.data.data);
            console.log(res.data.data)
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchBooks();
    },[]);

    const handleSubmit = async(borrowId, bookId, actionType) =>{
        try{
            console.log(bookId, borrowId, actionType)
            const res = await axios.post("http://127.0.0.1:5000/borrow-request",{
                "id": borrowId,
                "book_id": bookId,
                "request_type": actionType,
                "user_id": user_id,
                "borrow_days": 0,
                "remarks": remark
            });
            alert(res.data.message);
            window.location.reload();
        } catch(err){
            console.log(err);
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
                        {books
                        .filter(book=>book.status === "PENDING")
                        .map((book)=>(
                            <Card key={book.id} hoverable>
                                <Title level={5}>Book Title: <Text>{book.title}</Text></Title>
                                <Title level={5}>Author: <Text>{book.author}</Text></Title>
                                <Title level={5}>Username: <Text>{book.username}</Text></Title>
                                <Title level={5}>Category: <Text>{book.category}</Text></Title>
                                <Title level={5}>Email: <Text>{book.email}</Text></Title>
                                <Title level={5}>Phone : <Text>{book.phone}</Text></Title>
                                <Title level={5}>Total Copies : <Text>{book.total_copies}</Text></Title>
                                <Title level={5}>Available Copies : <Text>{book.available_copies}</Text></Title>
                                <Title level={5}>Requested Date: <Text>{book.request_date}</Text></Title>
                                <Title level={5}>Borrow Days : <Text>{book.borrow_days}</Text></Title>
                                <Title level={5}>Remark : 
                                    <Input placeholder='enter reject reason' value={remark}
                                    onChange={(e)=>{setRemark(e.target.value)}} />
                                </Title>
                                <br />
                                <div style={{
                                    display: 'flex',
                                    gap: '20px'
                                }}>
                                    <Button variant='solid' color='green'
                                    onClick={()=>{handleSubmit(book.id, book.book_id, "ACCEPT")}}
                                    >Accept</Button>
                                    <Button variant='solid' color='red'
                                    onClick={()=>{handleSubmit(book.id, book.book_id, "REJECT")}}
                                    >Reject</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BorrowRequest;