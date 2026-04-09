import { Card, Col, Drawer, Row, Typography, Tag, Button, InputNumber } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import '../../assets/Main.css';

const { Meta } = Card;
const { Text, Title } = Typography;
const ViewBooks = () => {

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookDrawer, setBookDrawer] = useState(false);
    const [open, setOpen] = useState(false);
    const [borrowDays, setBorrowDays] = useState(7);

    const showBookDrawer = () => setBookDrawer(true);
    const closeBookDrawer = () => setBookDrawer(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const handleBookClick = (book) => {
        setSelectedBook(book);
        setBookDrawer(true);
    }

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/books');
            setBooks(res.data.books);
        } catch (err) {
            console.log(err);
        }
    }

    const handleBookRequest = async(bookId) =>{
        try{
            const user_id = localStorage.getItem("b_user_id");
            const res = await axios.post("http://127.0.0.1:5000/book-request", {
                user_id: user_id,
                book_id: bookId,
                borrow_days: borrowDays
            });
            console.log(res.data);
            alert(res.data.message);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, [])
    return (
        <div>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ marginTop: '100px' }}>
                <Row>
                    <Col>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '40px',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                        }}>
                            {books.map((book) => (
                                <Card
                                    cover={<img src={book.image} onClick={() => { handleBookClick(book) }}
                                        style={{ width: '100%', height: '280px', objectFit: 'contain' }} />}
                                    className='card-ui'
                                >
                                    <Meta style={{ textAlign: 'center' }}
                                        description={<Text type='secondary'>{book.author}</Text>} />
                                </Card>
                            ))}
                        </div>
                    </Col>
                </Row>
                <div>
                    <Drawer
                        title={<Title level={4} style={{
                            marginTop: '10px',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                        }}>
                            Book Details
                        </Title>}
                        placement='right'
                        onClose={closeBookDrawer}
                        open={bookDrawer}
                        width={400}
                        style={{
                            background: ''
                        }}
                    >
                        <div>
                            {selectedBook && (
                                <Card key={selectedBook._id} style={{borderRadius: '14px',boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                }}>
                                    <div style={{
                                        display :'flex',
                                        flexDirection: 'column',
                                        textAlign: 'center',
                                        gap: '10px',
                                        fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                                    }}>
                                        <Card hoverable
                                        style={{background: 'rgba(0, 0, 0, 0.1)', padding: '20px',
                                            borderRadius: '12px',
                                            marginBottom: '20px'
                                        }}
                                        className='card-ui'
                                        >
                                            <img src={selectedBook.image}
                                            style={{ width: '100%', height: '230px', objectFit: 'contain' }} />
                                        </Card>
                                        <Title level={5}
                                            style={{ marginTop: '15px' }}
                                        >Title - {selectedBook.title}</Title>
                                        <Text>Author - {selectedBook.author}</Text>
                                        <Text>Category - {selectedBook.category}</Text>
                                        <Text>ISBN Number - {selectedBook.isbn}</Text>
                                        <Text>Status:
                                            {selectedBook.available_copies > 0 ? <Tag color={'green'} variant='filled'>
                                                <Text type='success'>Available</Text>
                                            </Tag> :
                                                <Tag color={'red'} variant='filled'>
                                                    <Text type='danger'>Out of stock</Text>
                                                </Tag>
                                            }</Text>
                                        <Text>Borrow Days</Text>
                                        <InputNumber 
                                        style={{marginLeft:'100px'}}
                                        min={1} 
                                        value={borrowDays}
                                        onChange={(value)=>{setBorrowDays(value)}} />
                                        <Button
                                            type='primary'
                                            block
                                            disabled={selectedBook.available_copies === 0}
                                            className='request-btn'
                                            onClick={() => handleBookRequest(selectedBook._id)}
                                        >
                                            Request Book
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

export default ViewBooks;