import { Button, Card, Col,InputNumber,Input, Row, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import "../../assets/CommonImages.css";


const { Text, Title } = Typography;
const {Meta} = Card;
const { Search } = Input;
const ViewBook = () => {

    const [books, setBooks] = useState([]);
    const [borrow_days, setBorrow_days] = useState(0);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => {
        setDrawerOpen(true);
    }

    const closeDrawer = () => {
        setDrawerOpen(false);
    }

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/books");
            setBooks(res.data.books);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleBorrowRequest = async (bookId) => {
        try {
            if (!borrow_days) {
                alert("Please enter borrow days");
                return;
            }
            const days = borrow_days[bookId]
            console.log(days)
            const userId = localStorage.getItem("b_user_id");
            const payload = {
                user_id: userId,
                book_id: bookId,
                borrow_days: days
            };
            console.log(payload)
            const res = await axios.post("http://127.0.0.1:5000/book-request", payload);
            alert(res.data.message);
            window.location.reload();
        } catch (err) {
            alert("Failed to send borrow request", err);
        }
    }

    return (
        <div style={{background: 'linear-gradient(135deg, #fff5f0, #ffe3d8, #ffd6c9)'}}>
            <Navtab onMenuClick={openDrawer} />
            <Sidebar open={drawerOpen} onClose={closeDrawer} />
            <div style={{textAlign: 'center'}}>
                <Search placeholder='serach books here'
                    style={{
                        width: '450px',
                        margin: '30px',
                        padding: '10px',
                    }}
                />
            </div>
            <Row>
                <Col>
                    <div style={{
                        display: 'flex', flexDirection: 'row', gap: '20px',
                        flexWrap: 'wrap', justifyContent: 'center', 
                    }}>
                        {books.map((book) => (
                            <Card hoverable
                                style={{
                                    width: '300px',
                                    borderRadius: '30px',
                                    textAlign:'center',
                                    background: 'rgba(0, 0, 0, 0.1)',
                                    backdropFilter: 'blur(12px)'
                                }}
                                cover={
                                    <img 
                                    src={book.image}
                                    style={{
                                        width: '100%',
                                        height: '250px',
                                        objectFit: 'contain',
                                        padding: '20px 20px'
                                    }}
                                    />
                                }
                            >
                               <Meta 
                               title={book.title}
                               description={
                                <div>
                                    <Text >Category - {book.category}</Text><br />
                                </div>
                               }
                               />
                                <Meta
                                description={
                                    <span>
                                        <Text>Borrow Days</Text> <InputNumber style={{
                                            marginTop: '20px', borderColor: '#EF3340'
                                        }}  min={1}
                                            value={borrow_days[book._id]}
                                            onChange={(value)=>{setBorrow_days(prev=>
                                            ({...prev, [book._id]:value})
                                            )}}
                                        />
                                    </span>
                                }
                                />
                                <br/>
                                <Meta 
                                title={
                                    <span>
                                        <Button htmlType='submit' variant='solid'
                                         style={{
                                                background: '#EF3340',
                                                color: 'white',
                                                margin: '10px',
                                                fontWeight: 600,
                                                borderColor: '#EF3340'
                                            }} onClick={() => { handleBorrowRequest(book._id) }}
                                        >Borrow Request</Button>
                                    </span>
                                }
                                />
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ViewBook;