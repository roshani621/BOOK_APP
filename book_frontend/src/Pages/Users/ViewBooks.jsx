import { Card, Col, Drawer, Row, Typography, Tag, Button, InputNumber, Rate, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import '../../assets/Main.css';
import { getAPI, postAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';

const { Meta } = Card;
const { Text, Title } = Typography;
const ViewBooks = () => {

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookDrawer, setBookDrawer] = useState(false);
    const [open, setOpen] = useState(false);
    const [borrowDays, setBorrowDays] = useState(7);
    const [selectedCat, setSelectedCat] = useState("All");

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
            const res = await getAPI(API.BOOKS);
            setBooks(res.data.books);
        } catch (err) {
            console.log(err);
        }
    }

    const handleBookRequest = async (bookId) => {
        try {
            const user_id = localStorage.getItem("b_user_id");
            const res = await postAPI(API.BOOK_REQUEST, {
                user_id: user_id,
                book_id: bookId,
                borrow_days: borrowDays
            });
            closeBookDrawer();
        } catch (err) {
            console.log(err);
        }
    }

    const category = ["All", ...new Set(books.map(b => b.category))];
    console.log(category);

    

    useEffect(() => {
        fetchBooks();
    }, [])
    return (
        <div className='layout-bg'>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ margin: '20px 20px' }}>
                <div>

                </div>
                <div>
                    <Title level={4} style={{
                        fontWeight: '600px', color: '#BFBFBF/sn'
                    }}>My Library</Title>
                </div>

                <div>
                    {category.map((cat)=>(
                        <Tag 
                        key={cat}
                        onClick={()=>{
                            setSelectedCat(cat)}}
                        style={{
                            cursor: 'pointer',
                            color: selectedCat === cat? '#ffffff' : '#d1d5db',
                            background: selectedCat === cat ? '#dc2626' : '#3f3f46',
                            fontSize: '13px', borderRadius: '999px', padding: '4px 12px',
                            fontWeight: '500px', margin: '20px 10px'
                        }}>{cat}</Tag>
                    ))}
                </div>
                <Row style={{marginTop: '20px'}}>
                    <Col style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '60px'
                            }}>
                        {books.filter(book=>
                            selectedCat === "All" ? true:book.category === selectedCat
                        ).map(book=>(
                            <Card style={{
                                background: '#232323',
                                borderColor: '#232323',
                                overflow: 'hidden',
                                width: '250px'
                            }}
                            onClick={()=>handleBookClick(book)}
                            >
                                <img src={book.image} style={{
                                    width: '200px',
                                    height:'300px',
                                    objectFit: 'cover',
                                    borderRadius: '12px'
                                }}/>

                                <div>
                                    <Title level={4} 
                                    ellipsis={{tooltip: book.book_name}}
                                    style={{color: '#fff'}}>{book.book_name}</Title>
                                    <Text style={{
                                        color:'#fff'
                                    }} type='secondary'>{book.author}</Text><br />
                                    <Tag
                                    style={{
                                        background: '#3f3f46',
                                        color: '#d1d5db',
                                        marginTop: '10px',
                                        borderRadius: '12px',
                                        padding: '2px 8px',
                                    }}
                                    >{book.category}</Tag>
                                </div>
                            </Card>        
                        ))} 
                    </Col>
                </Row>
                <div>
                    <Drawer
                        title={<Title level={4} style={{
                            marginTop: '10px', color:'#d1d5db',
                            fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                        }}>
                            Book Details
                        </Title>}
                        placement='right'
                        onClose={closeBookDrawer}
                        open={bookDrawer}
                        width={400}
                        style={{
                            background: '#2C2C2C'
                        }}
                    >
                        <div>
                            {selectedBook && (
                                <Card key={selectedBook.id} style={{
                                    borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    background: '#2C2C2C', borderColor:'#2C2C2C'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'center',
                                        gap: '10px',
                                        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                    }} className='vb-text'>
                                        <Card hoverable
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.1)', padding: '20px',
                                                borderRadius: '12px',
                                                marginBottom: '20px'
                                            }}
                                            className='card-ui'
                                        >
                                            <img src={selectedBook.image}
                                                style={{ width: '200px', height: '300px', objectFit: 'contain' }} />
                                        </Card>
                                        <Title level={5}
                                            style={{ marginTop: '15px' }}
                                        >Title - {selectedBook.book_name}</Title>
                                        <Text>Description - {selectedBook.description}</Text>
                                        <Text>Author - {selectedBook.author}</Text>
                                        <Text>Category - {selectedBook.category}</Text>
                                        <Text>ISBN Number - {selectedBook.isbn}</Text>
                                        <Text>Total Pages - {selectedBook.total_pages}</Text>
                                        <Text>Available Copies - {selectedBook.available_copies}</Text>
                                        <Text>Status:
                                            {selectedBook.available_copies > 0 ? 
                                            <Tag>Available</Tag> :
                                            <Tag>--</Tag>   
                                        }</Text>
                                        <Text>Rating - {selectedBook.rating}</Text>
                                        <Text>Borrow Days</Text>
                                        <InputNumber
                                            style={{ marginLeft: '100px' }}
                                            min={1}
                                            value={borrowDays}
                                            onChange={(value) => { setBorrowDays(value) }} />
                                        <Button
                                            type='primary'
                                            block
                                            disabled={selectedBook.available_copies === 0}
                                            className='request-btn'
                                            onClick={() => handleBookRequest(selectedBook.id)}
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