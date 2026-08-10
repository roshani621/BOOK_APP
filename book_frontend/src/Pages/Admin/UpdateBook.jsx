import { Button, Form, Input, InputNumber, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { BookOutlined, UploadOutlined } from '@ant-design/icons';
import { FaUserEdit } from "react-icons/fa";
import { BsUpcScan } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { TbBooks } from "react-icons/tb";
import { MdOutlineLibraryBooks } from "react-icons/md";
import axios from 'axios';

import '../../assets/Common.css';
import { getAPI, putAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';

const { TextArea } = Input;

const UpdateBook = () => {

    const [open, setOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    const [data, setData] = useState({
        id: "",
        book_name: '',
        author: '',
        category: '',
        image: '',
        isbn: '',
        total_pages: 0,
        total_copies: 0,
        available_copies: 0,
        rating: 1.5,
        description: '',
        short_description: '',
        publish_date: '',
        published_by: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => (
            {
                ...prev,
                [name]: value,
            }
        ));
    };


    const handleSubmit = async () => {
        try {
            const res = await putAPI(API.UPDATE_BOOK, data);
            console.log(data);

        } catch (err) {
            console.log(err);
        }
    }

    const fetchBooks = async () => {
        try {
            console.log("Sending:", data);
            const res = await getAPI(API.BOOKS);
            setBooks(res.data.books);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);


    const generateISBN = () => {
        const isbn = Math.floor(
            1000000000000 + Math.random() * 9000000000000
        ).toString();

        setData((prev) => ({
            ...prev,
            isbn,
        }));
    };

    return (
        <div className='layout-bg' style={{
            minHeight: '190vh'
        }}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <Form
                onFinish={handleSubmit}
                style={{
                    width: '550px',
                    height: '1040px',
                    border: '1px solid #dc2626',
                    borderRadius: '20px',
                    padding: '50px',
                    position: 'absolute',
                    top: '15%',
                    left: '33%',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    background: '#232323'
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px'
                }}>
                    <Form.Item layout='vertical'
                        label={'Select book want to update'}
                    >
                        <Select
                            placeholder='Select book from here'
                            onChange={(value) => {
                                const selected = books.find(book => book.id === value);
                                setData(selected);
                            }}
                        >
                            {books.map((book) => (
                                <Select.Option
                                    key={book.id}
                                    value={book.id}
                                >
                                    {book.book_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Book Name'}
                    >
                        <Input placeholder='enter book name' name='book_name' value={data.book_name}
                            prefix={<BookOutlined />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Author'}
                    >
                        <Input placeholder='enter author name' name='author' value={data.author}
                            prefix={<FaUserEdit />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px'
                }}>
                    <Form.Item layout='vertical'
                        label={'Category'}
                    >
                        <Input placeholder='enter book category' name='category' value={data.category}
                            onChange={handleChange}
                            prefix={<BiCategory />}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'ISBN Number'}
                    >
                        <Input placeholder='generate isbn number' name='isbn' value={data.isbn}
                            prefix={<BsUpcScan onClick={generateISBN} />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item layout='vertical'
                        label={'Book Image URL'}>

                        <Input placeholder='paste image url here' name='image' value={data.image}
                            onChange={handleChange}
                            prefix={<UploadOutlined />}
                        />

                    </Form.Item>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'
                }}>
                    <Form.Item layout='vertical'
                        label={'Total Copies'}
                    >
                        <InputNumber min={1} name='total_copies' value={data.total_copies}
                            onChange={(value) => setData({ ...data, total_copies: value })}
                            prefix={<TbBooks />}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Available Copies'}
                    >
                        <InputNumber min={1} name='available_copies' value={data.available_copies}
                            onChange={(value) => setData({ ...data, available_copies: value })}
                            prefix={<MdOutlineLibraryBooks />}
                        />
                    </Form.Item>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'
                }}>
                    <Form.Item layout='vertical'
                        label={'Total Pages'}
                    >
                        <InputNumber min={1} name='total_pages' value={data.total_pages}
                            onChange={(value) => setData({ ...data, total_pages: value })}
                            prefix={<TbBooks />}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Rating'}
                    >
                        <InputNumber min={1.5} name='rating' value={data.rating}
                            onChange={(value) => setData({ ...data, rating: value })}
                            prefix={<MdOutlineLibraryBooks />}
                        />
                    </Form.Item>
                </div>
                <Form.Item layout='vertical'
                    label={'Short Description'}
                >
                    <Input placeholder='enter short description of book' name='short_description' value={data.short_description}
                        prefix={<BookOutlined />}
                        onChange={handleChange}
                    />
                </Form.Item>
                <Form.Item layout='vertical'
                    label={'Description'}
                >
                    <TextArea rows={5} placeholder='enter description about book' name='description' value={data.description}
                        prefix={<BookOutlined />}
                        onChange={handleChange}
                    />
                </Form.Item>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px'
                }}>
                    <Form.Item layout='vertical'
                        label={'Publish Date'}
                    >
                        <Input placeholder='enter book name' name='publish_date' value={data.publish_date}
                            prefix={<BookOutlined />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Published By'}
                    >
                        <Input placeholder='enter publisher name' name='published_by' value={data.published_by}
                            prefix={<BookOutlined />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button style={{
                        width: '100%',
                        background: '#dc2626',
                        color: '#fff',
                        fontWeight: 500,
                        forntSize: '17px'
                    }}
                        type='danger'
                        htmlType='submit'>Update Book</Button>
                </Form.Item>
            </Form>
        </div>

    );
};

export default UpdateBook;