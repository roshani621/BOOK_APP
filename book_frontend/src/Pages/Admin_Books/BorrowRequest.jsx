import { Button, Card, Col, Input, Row, Typography, Space, Collapse, Divider } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import '../../assets/CommonImages.css';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaBook, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';

const { Panel } = Collapse;
const { Text, Title } = Typography;
const { Search } = Input;
const { Meta } = Card;
const BorrowRequest = () => {

    const [books, setBooks] = useState([]);

    const [remark, setRemark] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [open, setOpen] = useState(false);

    const openDrawer = () => {
        setDrawerOpen(true);
    }

    const closeDrawer = () => {
        setDrawerOpen(false);
    }

    const user_id = localStorage.getItem("b_user_id");
    console.log(user_id)
    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/borrow-books");
            setBooks(res.data.data);
            console.log(res.data.data)
            console.log("borrow")
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async (borrowId, bookId, actionType) => {
        try {
            console.log(bookId, borrowId, actionType)
            const res = await axios.post("http://127.0.0.1:5000/borrow-request", {
                "id": borrowId,
                "book_id": bookId,
                "request_type": actionType,
                "user_id": user_id,
                "borrow_days": 0,
                "remarks": remark
            });
            alert(res.data.message);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #fff5f0, #ffe3d8, #ffd6c9)', minHeight: '100vh' }}>
            <Navtab onMenuClick={openDrawer} />
            <Sidebar open={drawerOpen} onClose={closeDrawer} />
            <div style={{ textAlign: 'center' }}>
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
                        display: 'flex', flexDirection: 'row', gap: '50px', flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        {books
                            .filter(book => book.status === "PENDING")
                            .map((book) => (
                                <Space vertical size={16}>
                                    <Card
                                        cover={<img
                                            alt='book'
                                            src={book.image}
                                            style={{
                                                width: '250px',
                                                height: '200px',
                                                objectFit: 'contain',
                                                padding: '10px'
                                            }}
                                        />}
                                        className="glass-card">
                                        <Collapse ghost onChange={()=>{setOpen(!open)}}>
                                            <Panel header={open? "Show Less": "Show More"} key={'1'}>
                                                <Meta 
                                                title={<span style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <Title level={4}>{book.title}</Title>
                                                    {book.status === 'PENDING'?
                                                    <Text style={{color: 'red',
                                                        fontSize: '12pt'
                                                    }}>{book.status}</Text>:
                                                    <Text></Text>    
                                                }
                                                </span>}
                                                />
                                                <Divider />
                                                <Meta
                                                    title={<span>
                                                        <FaBook className='icon' color='red' /> Book Details
                                                    </span>}
                                                    description={
                                                        <span>
                                                            <div className="meta-row">
                                                                <Text strong>Author: </Text>
                                                                <Text>{book.author}</Text>
                                                            </div>

                                                            <div className="meta-row">
                                                                <Text strong>Category: </Text>
                                                                <Text>{book.category}</Text>
                                                            </div>

                                                            <div className="meta-row">
                                                                <Text strong>Available Copies: </Text>
                                                                <Text>{book.available_copies}</Text>
                                                            </div>
                                                        </span>
                                                    }
                                                />
                                                <br />
                                                <Meta
                                                    title={<span>
                                                        <FaUserCircle className='icon' color='blue' /> User Details
                                                    </span>}
                                                    description={
                                                        <span>
                                                            <div className="meta-row">
                                                                <Text strong>User: </Text>
                                                                <Text>{book.username}</Text>
                                                            </div>

                                                        </span>
                                                    }
                                                />
                                                <br />
                                                <Meta
                                                    title={<span>
                                                        <FaCalendarAlt className='icon' color='#10b981' /> Dates
                                                    </span>}
                                                    description={
                                                        <span>
                                                            <div className="meta-row">
                                                                <Text strong>Requested Date: </Text>
                                                                <Text>{book.request_date}</Text>
                                                            </div>
                                                            <div className="meta-row">
                                                                <Text strong>Borrow Days: </Text>
                                                                <Text>{book.borrow_days}</Text>
                                                            </div>
                                                        </span>
                                                    }
                                                />
                                                <br />
                                                <Meta
                                                    description={
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: '20px'
                                                        }}>
                                                            <Button variant='solid' color='green'
                                                                onClick={() => { handleSubmit(book.id, book.book_id, "ACCEPT") }}
                                                            >Accept</Button>
                                                            <Button variant='solid' color='red'
                                                                onClick={() => { handleSubmit(book.id, book.book_id, "REJECT") }}
                                                            >Reject</Button>
                                                        </div>
                                                    }
                                                />
                                            </Panel>
                                        </Collapse>
                                    </Card>
                                </Space>
                            ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BorrowRequest;