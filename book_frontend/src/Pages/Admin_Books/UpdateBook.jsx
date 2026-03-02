    import { Button, Form, Input, Typography } from 'antd';
    import axios from 'axios';
    import React, { useEffect, useState } from 'react';
    import Navtab from '../Components/Navtab';
    import Sidebar from '../Components/Sidebar';

    const { Text, Title } = Typography;
    const { Search } = Input;
    const UpdateBook = () => {

        const [bookId, setBookId] = useState("");

        const [book, setBook] = useState({
            title: "",
            author: "",
            category: "",
            isbn: "",
            total_copies: 0,
            available_copies: 0
        });

        const getBookId = async (bookId) => {
            try {
                console.log(bookId);
                const res = await axios.get(`http://127.0.0.1:5000/book/${bookId}`);
                setBook(res.data.book);
            } catch (err) {
                alert("Book not found")
            }
        }

        const [drawerOpen, setDrawerOpen] = useState(false);

        const openDrawer = () => {
            setDrawerOpen(true);
        }

        const closeDrawer = () => {
            setDrawerOpen(false);
        }


        const handleChange = (e) => {
            const { name, value } = e.target;
            setBook((prev)=>({
                ...prev,
                [name]: value
            }))
        }

        const handleSubmit = async() =>{
            try{
                const res = await axios.put(`http://127.0.0.1:5000/update-book/${bookId}`, book);
                console.log(res.data);
                alert(res.data.message);
                window.location.reload();
            } catch(err){
                console.log(err);
            }
        }


        const [form] = Form.useForm();

        return (
            <div>
                <Navtab onMenuClick={openDrawer} />
                <Sidebar open={drawerOpen} onClose={closeDrawer} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Form form={form} onFinish={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '350px'
                    }}>
                        <Title level={4} style={{ textAlign: 'center' }}>Update Book</Title>
                        <Form.Item label={'Book ID'}>
                            <Input placeholder='enter book id' value={bookId}
                            onChange={(e)=>{setBookId(e.target.value)}}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type={'primary'} onClick={()=>{getBookId(bookId)}}>Fetch</Button>
                        </Form.Item>

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
                            <Input name='total_copies' placeholder='enter total copies in number'
                                value={book.total_copies} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'Available Copies'}
                        >
                            <Input name='available_copies' placeholder='enter available copies in number'
                                value={book.available_copies} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button htmlType='submit'>Update Book</Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        );
    };

    export default UpdateBook;