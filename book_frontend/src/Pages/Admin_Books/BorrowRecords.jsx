import { Button, Card, Col, Input, Row, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import "../../assets/CommonImages.css";

const {Text, Title} = Typography;
const { Search } = Input;
const BorrowRecords = () => {

    const [books, setBooks] = useState([]);

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
            <Row style={{display: 'flex', justifyContent: 'center'}}>
                <Col>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '30px',
                        flexWrap: 'wrap', justifyContent:'center', fontWeight: '40px'
                    }}>
                        {books.map((book)=>(
                            <Card key={book.id} hoverable className='images'>
                                <Title level={5}>Book Title: <Text>{book.title}</Text></Title>
                                <Title level={5}>Username: <Text>{book.username}</Text></Title>
                                <Title level={5}>Category: <Text>{book.category}</Text></Title>
                                <Title level={5}>Email: <Text>{book.email}</Text></Title>
                                <Title level={5}>Phone : <Text>{book.phone}</Text></Title>
                                {/* <Title level={5}>Total Copies : <Text>{book.total_copies}</Text></Title>
                                <Title level={5}>Available Copies : <Text>{book.available_copies}</Text></Title> */}
                                <Title level={5}>Requested Date: <Text>{book.request_date}</Text></Title>
                                <Title level={5}>Status : <Text>{book.status}</Text></Title>
                                {book.status === 'ACCEPT'? 
                                    <Title level={5}>Approved Date: {book.approved_date}</Title>:
                                    <Title level={5}>Rejected Date: {book.approved_date}</Title>
                                }
                                <Title level={5}>Remark : <Text>{book.remarks}</Text></Title>
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BorrowRecords;