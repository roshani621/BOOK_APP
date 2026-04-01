import { Button, Form, Input, InputNumber, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import '../../assets/CommonImages.css';
const Add_Book = () => {

    const [book, setBook] = useState({
        title: "",
        author: "",
        category: "",
        isbn: "",
        total_copies: 0,
        available_copies: 0
    });

    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    }

    const handleNumber = (name, value)=>{
            setBook((prev)=>({
                ...prev,
                [name]:value
            }))
        }

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`http://127.0.0.1:5000/add-book`, book);
            console.log(res.data);
            alert(res.data.message);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }


    const [form] = Form.useForm();

    return (
        <div style={{
            background: 'linear-gradient(135deg, #6D597A 0%, #B56576 50%, #E56B6F 100%)', 
            minHeight: '100vh', 
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navtab onMenuClick={openDrawer} />
            <Sidebar open={drawerOpen} onClose={closeDrawer} />
            <div style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 20px',
                minHeight: 'calc(100vh - 90px)'
            }}>
                <Form form={form} onFinish={handleSubmit} style={{
                    width: '420px',
                    maxWidth: '100%',
                    padding: '30px 50px',
                    borderRadius: '20px',
                    paddingTop: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderColor: '#6D597A'
                }}>

                    <Form.Item
                        label={'Title'}
                    >
                        <Input name='title' placeholder='enter book name'
                            value={book.title} onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Author'}
                    >
                        <Input name='author' placeholder='enter author name'
                            value={book.author} onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Category'}
                    >
                        <Input name='category' placeholder='enter category name'
                            value={book.category} onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'ISBN'}
                    >
                        <Input name='isbn' placeholder='enter isbn number'
                            value={book.isbn} onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Total Copies'}
                    >
                        <InputNumber min={0} className='input-number'
                            value={book.total_copies} 
                            onChange={(value)=>{handleNumber("total_copies", value)}}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Available Copies'}
                    >
                        <InputNumber min={0} className='input-number'
                            value={book.available_copies} 
                            onChange={(value)=>{handleNumber("available_copies", value)}}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button variant='solid' color='primary' htmlType='submit'>ADD Book</Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    );
};

export default Add_Book;