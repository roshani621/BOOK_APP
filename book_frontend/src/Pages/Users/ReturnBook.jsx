import { Button, Card, Col, Input, Row, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';

const {Text, Title} = Typography;
const { Search } = Input;
const ReturnBook = () => {

    const [books, setBooks] = useState([]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const openDrawer = () =>{
        setDrawerOpen(true);
    }
    
    const closeDrawer = () =>{
        setDrawerOpen(false);
    }

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
            <Row>
                <Col>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '20px',
                        flexWrap: 'wrap', justifyContent:'center'
                    }}>
                        {books.length > 0 ? (books.map((book)=>(
                            <Card key={book._id} hoverable>
                                <Title level={5}>Book Title: <Text>{book.title}</Text></Title>
                                <Title level={5}>Author: <Text>{book.author}</Text></Title>
                                <Title level={5}>Username: <Text>{book.username}</Text></Title>
                                <Title level={5}>Category: <Text>{book.category}</Text></Title>
                                <Title level={5}>Status: 
                                    <Text>{book.status === "ACCEPT"? <Text style={{
                                        color: "green"
                                    }}>{book.status}</Text>:
                                     <Text style={{color: "red"}}>{book.status}</Text>}</Text></Title>
                                <Title level={5}>Remark: <Text>{book.remarks}</Text></Title>
                                <Title level={5}>Email: <Text>{book.email}</Text></Title>
                                <Title level={5}>Phone : <Text>{book.phone}</Text></Title>
                                <Title level={5}>Borrow Days: <Text>{book.borrow_days}</Text></Title>
                                <Title level={5}>Requested Date: <Text>{book.request_date}</Text></Title>
                                <Title level={5}>Return Date: <Text>{book.return_date}</Text></Title>
                            </Card>
                        ))
                    ):(
                        <div>
                            <Title level={5}>No record found!</Title>
                        </div>
                    )} 
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ReturnBook;