import { Button, Card, Col, Input, Row, Tag, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import '../../assets/CommonImages.css';

const { Text, Title } = Typography;
const { Search } = Input;
const {Meta} = Card;
const MyBorrowBook = () => {

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
        <div style={{background: 'linear-gradient(135deg, #fff5f0, #ffe3d8, #ffd6c9)',
            minHeight: '100vh'
        }}>
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
            <Row style={{display: 'flex', justifyContent:'center'}}>
                <Col style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                        gap:'25px', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {books.map((book)=>(
                            <Card hoverable
                            style={{
                                textAlign:' center',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                width: '250px',
                            }}
                            cover={
                                <img 
                                src={book.image}    
                                alt={book.title}
                                style={{
                                    width: '100%',
                                    height:'200px',
                                    objectFit: 'contain',
                                    margin: '10px'
                                }}
                                />
                            } className='glass-card'>
                                <Meta 
                                title={
                                    <span>
                                        <Title level={4}>{book.title}</Title>
                                    </span>
                                }

                                description={
                                    <span>
                                        <Text>Author - {book.author}</Text><br />
                                        <Text>Category - {book.category}</Text><br />
                                        {book.status === 'ACCEPT'?
                                        <Text>Borrow Days - {book.borrow_days}</Text> :
                                        <Text></Text>   
                                    }
                                    </span>
                                }
                                />
                            </Card>
                        ))}
                </Col>
            </Row>
        </div>
    );
};

export default MyBorrowBook;