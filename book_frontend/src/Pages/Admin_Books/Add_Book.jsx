import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import axios from 'axios';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import "../../assets/Page.css";
import { Content } from 'antd/es/layout/layout';

const { Title } = Typography;
const Add_Book = () => {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => {
        setDrawerOpen(true);
    }

    const closeDrawer = () => {
        setDrawerOpen(false);
    }

    const [books, setBooks] = useState({
        title: '',
        author: '',
        category: '',
        isbn: '',
        total_copies: 0,
        available_copies: 0
    });

    console.log(books)
    const [form] = Form.useForm();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooks({ ...books, [name]: value });
    }

    const handleSubmit = async () => {
        try {
            await axios.post("http://127.0.0.1:5000/add-book", {
                ...books,
                total_copies: Number(books.total_copies),
                available_copies: Number(books.available_copies)
            });
            alert("Book added successfully");
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <Navtab onMenuClick={openDrawer} />
            <Sidebar open={drawerOpen} onClose={closeDrawer} />
            <Content>
                <div ></div>
                <div className='dashboard-page' style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <Form form={form} onFinish={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '350px',
                        fontWeight: '70px'
                    }}>
                        <Title level={4} style={{ textAlign: 'center' }}>Add Book</Title>
                        <Form.Item
                            label={'Title'}
                        >
                            <Input name='title' placeholder='enter book name'
                                value={books.title} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'Author'}
                        >
                            <Input name='author' placeholder='enter author name'
                                value={books.author} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'Category'}
                        >
                            <Input name='category' placeholder='enter category name'
                                value={books.category} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'ISBN'}
                        >
                            <Input name='isbn' placeholder='enter isbn number'
                                value={books.isbn} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'Total Copies'}
                        >
                            <Input name='total_copies' placeholder='enter total copies in number'
                                value={books.total_copies} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'Available Copies'}
                        >
                            <Input name='available_copies' placeholder='enter available copies in number'
                                value={books.available_copies} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button htmlType='submit' variant='solid' color='primary'>Add Book</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </div>
    );
};

export default Add_Book;