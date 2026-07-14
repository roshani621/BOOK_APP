import { Button, Divider, Form, Input, InputNumber, Upload, DatePicker } from 'antd';
import React, { useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import '../../assets/Common.css';
import { BookOutlined } from '@ant-design/icons';
import { FaUserEdit } from "react-icons/fa";
import { BsUpcScan } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { TbBooks } from "react-icons/tb";
import { MdOutlineLibraryBooks } from "react-icons/md";
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { postAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';

const AddBook = () => {

    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    const [data, setData] = useState({
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
        publish_date: '',
        published_by: ''
    });

    const handleChange = (e, field) => {
        if (e?.target) {
            const { name, value } = e.target;
            setData({ ...data, [name]: value });
        } else {
            setData({ ...data, [field]: e });
        }
    }

    console.log(data);
    const handleSubmit = async () => {
        try {

            const res = await postAPI(API.ADD_BOOK, data);

            setData({
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
                publish_date: '',
                published_by: ''
            })
        } catch (err) {
            console.log(err);
        }
    }

    const generateISBN = () => {
        const isbn = Math.floor(
            1000000000000 + Math.random() * 9000000000000
        ).toString();

        setData({ ...data, isbn: isbn });
    };
    return (
        <div className='layout-bg' style={{
            height: '142vh'
        }}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <Form
                onFinish={handleSubmit}
                style={{
                    width: '550px',
                    height: '750px',
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
                        label={'Title'}
                    >
                        <Input placeholder='enter book name' name='book_name' value={data.book_name}
                            prefix={<BookOutlined />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Author'}
                    >
                        <Input placeholder='enter book author' name='author' value={data.author}
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
                        label={'Book Image'}
                    >
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
                        <InputNumber min={1} value={data.total_copies}
                            onChange={(value) => setData({ ...data, total_copies: value })}
                            prefix={<TbBooks />}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Avaialble Copies'}
                    >
                        <InputNumber min={1} value={data.available_copies}
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
                        <InputNumber min={1} value={data.total_pages}
                            onChange={(value) => setData({ ...data, total_pages: value })}
                            prefix={<TbBooks />}
                        />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Rating'}
                    >
                        <InputNumber min={1.5} value={data.rating}
                            onChange={(value) => setData({ ...data, rating: value })}
                            prefix={<MdOutlineLibraryBooks />}
                        />
                    </Form.Item>
                </div>
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
                        <DatePicker value={data.publish_date ? dayjs(data.publish_date) : null}
                            prefix={<BookOutlined />}
                            onChange={(date, dateString) =>
                                setData({
                                    ...data,
                                    publish_date: dateString
                                })
                            } />
                    </Form.Item>
                    <Form.Item layout='vertical'
                        label={'Published By'}
                    >
                        <Input placeholder='enter book name' name='published_by' value={data.published_by}
                            prefix={<BookOutlined />}
                            onChange={handleChange}
                        />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button style={{
                        width: '100%'
                    }}
                        type='primary' htmlType='submit'>Add Book</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddBook;