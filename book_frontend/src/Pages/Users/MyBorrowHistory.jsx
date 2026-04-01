import { Button, Card, Col, Input, Row,Collapse, Typography, Space, Divider } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaBook, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import "../../assets/CommonImages.css";

const { Text, Title } = Typography;
const { Search } = Input;
const {Meta} = Card;
const {Panel} = Collapse;
const MyBorrowHistory = () => {

    const [books, setBooks] = useState([]);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => {
        setDrawerOpen(true);
    }

    const closeDrawer = () => {
        setDrawerOpen(false);
    }

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/my-books");
            setBooks(res.data.data);
            console.log(res.data.data)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);


    return (
        <div style={{background: 'linear-gradient(135deg, #fff5f0, #ffe3d8, #ffd6c9)'}}>
            <Navtab onMenuClick={openDrawer} />
            <Sidebar open={drawerOpen} onClose={closeDrawer} />
            <div style={{ textAlign: 'center' }}>
                <Search placeholder='serach books here'
                    style={{
                        width: '450px',
                        margin: '50px',
                        padding: '10px',
                    }}
                />
            </div>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col style={{
                    display: 'flex', flexDirection: 'row', gap: '50px', flexWrap: 'wrap',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    {books.length > 0 ? (
                        books.map((book) => (
                            <Space vertical size={16}>
                                <Card
                                    cover={<img
                                        alt='book'
                                        src={book.image}
                                        className="book-card-img"
                                    />}
                                   className='glass-card'>

                                    <Divider style={{ margin: "12px 0" }} />
                                    <Collapse ghost>
                                        <Panel header='show more'>
                                            <Meta
                                                title={<span className='section-title'>
                                                    <FaBook className='icon' color='#ff7e5f' /> Book Details
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
                                                    </span>
                                                }
                                            />
                                            <Divider style={{ margin: "12px 0" }} />
                                            <Meta
                                                title={<span className='section-title'>
                                                    <FaUserCircle className='icon' color=' #3b82f6' /> User Details
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
                                                    </span>
                                                }
                                            />
                                            <Divider />
                                            <Meta
                                                title={
                                                    <span>
                                                        <Text>{book.status === 'ACCEPT' ?
                                                            <Title level={5} style={{
                                                                color: '#22C55E',
                                                                fontWeight: 630,
                                                            }}>{book.status}</Title> :
                                                            <Title level={5} style={{
                                                                color: '#FF0000',
                                                                fontWeight: 630,
                                                            }}> {book.status}</Title>
                                                        }</Text>
                                                    </span>
                                                }
                                            />
                                            <Divider style={{ margin: "12px 0" }} />
                                            <Meta
                                                title={<span className='section-title'>
                                                    <FaCalendarAlt className='icon' color='#10b981' /> Dates
                                                </span>}
                                                description={
                                                    <span>
                                                        <div className="meta-row">
                                                            <Text strong>Requested Date: </Text>
                                                            <Text>{book.request_date}</Text>
                                                        </div>

                                                        <div className="meta-row">
                                                            {book.status === 'ACCEPT' ?
                                                                <div className="meta-row">
                                                                    <Text strong>Approved Date: </Text>
                                                                    <Text>{book.approved_date}</Text>
                                                                </div> :
                                                                <div className="meta-row">
                                                                    <Text strong>Rejected Date: </Text>
                                                                    <Text>{book.approved_date}</Text>
                                                                </div>
                                                            }
                                                        </div>
                                                    </span>
                                                }
                                            />
                                            <Divider style={{ margin: "12px 0" }} />
                                            <Meta
                                                title={<span className='section-title'>
                                                    <IoChatbubbleEllipses className='icon' color=' #8b5cf6' /> Remark
                                                </span>}
                                                description={
                                                    <span>
                                                        <div className="meta-row">
                                                            <Text>{book.remarks}</Text>
                                                        </div>
                                                    </span>
                                                }
                                            />
                                            <Divider style={{ margin: "12px 0" }} />
                                            <Meta
                                                title={<div style={{ display: 'flex', justifyContent: 'end' }}>
                                                    {book.status === 'ACCEPT' ?
                                                        <Text>✔ Approved By - {book.approved_by}</Text> :
                                                        <Text></Text>
                                                    }
                                                </div>}
                                            />
                                        </Panel>
                                    </Collapse>
                                </Card>
                            </Space>
                        ))

                    ) : (
                        <div>
                            <Title level={5}>No record found!</Title>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default MyBorrowHistory;