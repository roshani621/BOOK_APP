import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Flex, Layout, Row, Typography } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import '../../assets/CommonImages.css';

const { Content } = Layout;
const {Meta} = Card;
const {Text, Title} = Typography;
const Dash_Content = () => {
    const [data, setData] = useState({});

    const books = data.books || [];

    const user_count = data.user_count || 0;
    const borrow_book = data.borrow_book || 0;
    const approve_count = data.approve_count || 0;
    const reject_count = data.reject_count || 0;
    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/books");
            setData(res.data.count);
            console.log("Data",res.data.count)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const COLORS = [
        "#6366F1", // indigo
        "#8B5CF6", // violet
        "#EC4899", // pink
        "#F59E0B", // amber
        "#10B981", // emerald
        "#06B6D4", // cyan
        "#EF4444"  // red
    ];

    const unique_books = Object.values(books.reduce((sum, book)=>{
        if(!sum[book.category]){
            sum[book.category] = {
                category: book.category,
                available_copies: 0
            }
        }
        sum[book.category].available_copies += Number(book.available_copies || 0 );
        return sum;
    }, {}))

    const total_books = books.reduce((sum, b)=>{
        return sum + Number(b.total_copies || 0)
    }, 0);

    const available_copies = books.reduce((sum, b)=>{
        return sum+Number(b.available_copies || 0)
    }, 0);

    
    console.log(books)
    return (
        <Content>
            <div style={{display: 'flex', justifyContent: 'space-around',
                marginTop: '50px', 
            }}>
            <div style={{
                width: '490px',
                height: '330px',
                border: '1px solid white',
                borderRadius: '20px',
                background: '#FAEBD7',
                boxShadow: '2px 10px 24px rgba(0, 0, 0, 0.25)',
                padding: '30px',
            }} >
                <PieChart width={400} height={300}>
                    <Pie
                        data={unique_books}
                        dataKey={'available_copies'}
                        nameKey={'category'}
                        cx={'50%'}
                        cy={'50%'}
                        outerRadius={100}
                        label
                    >
                        {unique_books.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
                </div>
                <div style={{
                    height: '380px',
                    width: '450px'
                }}>
                    <Card hoverable style={{background: '#B4A7D6',
                        borderRadius: '20px',
                        backdropFilter: 'blur(12px)',
                    }}>
                    <Meta 
                    title={
                        <div>
                            <Title level={4}>Total Books - {total_books}</Title><br />
                            <Title level={4}>Available Copies - {available_copies}</Title>
                            <Title level={4}>Users - {user_count}</Title>
                            <Title level={4}>Borrow Books - {borrow_book}</Title>
                            <Title level={5}>Accepted Request - {approve_count}</Title>
                            <Title level={5}>Reject Request - {reject_count}</Title>
                        </div>
                    }
                    />
                </Card>
                </div>
            </div>

            <div>
                <Row>
                    <Col style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '50px',
                        justifyContent: 'center',
                        marginTop: '50px'
                    }}>
                        {books.map((book) => (
                            <Card className='book-card'
                            // actions={[
                            //             <Title level={5}>{book.title}</Title>
                            //         ]}
                            >
                                <div style={{textAlign: 'center'}}>
                                    <img
                                        src={book.image}
                                        alt={book.title}

                                        style={{
                                            width: '200px',
                                            height: '290px',
                                            textAlign: 'center',
                                            borderRadius: '10px'
                                        }}
                                    />
                                    <Title level={5}>{book.title}</Title>
                                    <Text type='secondary'>{book.author}</Text>
                                </div>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </div>
        </Content>
    );
};

export default Dash_Content;