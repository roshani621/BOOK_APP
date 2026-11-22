import { Button, Divider, Form, Input, InputNumber, Card, DatePicker, Typography, Steps, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import '../../assets/Common.css';
import { BookOutlined } from '@ant-design/icons';
import { FaBookOpen, FaBoxes, FaDatabase, FaFileAlt, FaSearch, FaUserEdit } from "react-icons/fa";
import { BsUpcScan } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { TbBooks } from "react-icons/tb";
import { MdOutlineLibraryBooks } from "react-icons/md";
import dayjs from 'dayjs';
import { getAPI, putAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';
import NotificationSocket from '../../services/NotificationSocket';
import { showMessage } from '../../Components/NotificationMessage';


const { TextArea } = Input;
const { Title, Text } = Typography;
const UpdateBook = () => {

    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const [current, setCurrent] = useState(0);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [books, setBooks] = useState([]);
    const [form] = Form.useForm();

    const stepsItems = [
        {
            title: <Title level={4} className='title-add'>Select Book</Title>,
            content: <Text className='text-add'>Choose which existing book you want to update.</Text>,
            icon: <FaSearch color='#C92D30' />
        },
        {
            title: <Title className='title-add' level={4}>Basic Information</Title>,
            content: <Text className='text-add'>All basic information of book</Text>,
            icon: <FaBookOpen color='#C92D30'/>
        },
        {
            title: <Title level={4} className='title-add'>Inventory Details</Title>,
            content: <Text className='text-add'>Inventory details of books like available books</Text>,
            icon: <FaDatabase color='#C92D30' />
        },
        {
            title: <Title level={4} className='title-add'>About Book</Title>,
            content: <Text className='text-add'>Description of book and Review & Submit</Text>,
            icon: <FaFileAlt color='#C92D30' />
        }
    ]

    const stepFields = [
        [],
        ['book_name', 'author', 'category', 'isbn'],
        ['total_copies', 'available_copies', 'total_pages', 'rating', 'publish_date', 'published_by'],
        ['image', 'short_description', 'description']
    ];

    const nextStep = async () => {
        if(current === 0 && !selectedBookId){
            showMessage('error', 'Please select a book first');
            return;
        }

        try {
            await form.validateFields(stepFields[current]);

            setCurrent(prev => prev + 1);
        } catch (err) {
            console.log(err);
        }
    }

    const previouseStep = () => {
        setCurrent(current - 1);
    }

    const handleNotification = (notification) => {
        console.log("New Book received notification: ", notification)
    }

    const generateISBN = () => {
        const isbn = Math.floor(
            1000000000000 + Math.random() * 9000000000000
        ).toString();

        form.setFieldValue('isbn', isbn)
    };

    const handleSubmit = async () => {
        if(current !== 3){
                console.log("Please complete all steps first");
                return;
            }
        if(!selectedBookId){
            showMessage('error', 'Please select a book');
            return;
        }
        try {
            
            const allValues = form.getFieldsValue(true);
            console.log("All from values: ", allValues);
            console.log("Publish Date: ",allValues.publish_date);

            const publishDate = allValues.publish_date;

            const finalData = {
                ...allValues,
                publish_date: publishDate
                    ? dayjs(publishDate).format('YYYY-MM-DD')
                    : null
            }

            console.log("Final API: ", finalData);

            const res = await putAPI(`${API.UPDATE_BOOK}/${selectedBookId}`, finalData);

            console.log("Updated Book:", res.data);

            showMessage('success', 'Book details have been updated!');

            form.resetFields();
            setSelectedBookId(null);
            setCurrent(0);

        } catch (err) {
            showMessage('error', "Something went wrong");
        }
    }

    const handleBookSelect = async(bookId) =>{
        try{
            const selectedBook = books.find((book)=> book.id === bookId);

            if(!selectedBook) return;

            setSelectedBookId(bookId);

            form.resetFields();

            const formattedData = {
                ...selectedBook,
                publish_date: selectedBook.publish_date
                    ? dayjs(selectedBook.publish_date)
                    : null
            }

            form.setFieldsValue(formattedData);
    
            setCurrent(0);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        const fetchBook = async() =>{
            try{
                const res = await getAPI(API.BOOKS);
                setBooks(res.data.books);
                console.log("API Publish Date:", res.data.books[0].publish_date);

            } catch(err){
                console.log(err);
            }
        }
        fetchBook();
    }, []);

    return (
        <div className='layout-bg' >
            <NotificationSocket onNotification={handleNotification} />
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div>
                <Title style={{
                    color: '#FFFFFF',
                    fontWeight: 600,
                    padding: '6px 12px'
                }} level={3}>Update Book</Title>
                <Form
                    form={form}
                    layout='vertical'
                    preserve={true}
                    
                >
                    <Steps
                        responsive
                        items={stepsItems}
                        current={current}
                        style={{
                            padding: '25px 40px',
                            marginBottom: '25px'
                        }}
                    />
                    {current === 0 && (
                        <>
                            <div style={{ padding: '8px 16px', margin: '8px 16px' }}>
                                <Title level={4} className='title-add'>Select Book</Title>
                                <Text type="secondary" className='text-add'>
                                    Select book you want to update.
                                </Text>
                            </div>
                            <div>
                                <Card style={{background: '#171717', border:'none'}}>
                                    <Form.Item label={'Choose Book'}>
                                        <Select 
                                            showSearch
                                            placeholder={'Search book by title or ID'}
                                            style={{width: 350}}
                                            options={books.map((book)=>({
                                                value: book.id,
                                                label: `${book.book_name} (${book.id})`
                                            }))}
                                            value={selectedBookId}
                                            onChange={handleBookSelect}
                                        />
                                    </Form.Item>
                                </Card>
                            </div>
                        </>
                    )}
                    {current === 1 && (
                        <>
                            <div style={{ padding: '8px 16px', margin: '8px 16px' }}>
                                <Title level={4} className='title-add'>Basic Information</Title>
                                <Text type="secondary" className='text-add'>
                                    All basic information of book
                                </Text>
                            </div>
                            <Card style={{background: '#171717', border:'none'}}>
                            <div style={{ padding: '6px 12px' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 300px)',
                                    gap: '30px'
                                }}>
                                    <Form.Item
                                        name={'book_name'}
                                        label={'Title'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'enter book name'
                                            }
                                        ]}
                                    >
                                        <Input prefix={<BookOutlined />} />
                                    </Form.Item>
                                    <Form.Item
                                        name={'author'}
                                        label={'Author'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'enter author name'
                                            }
                                        ]}
                                    >
                                        <Input prefix={<FaUserEdit />} />
                                    </Form.Item>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 300px)',
                                    gap: '30px'
                                }}>
                                    <Form.Item
                                        name={'category'}
                                        label={'Category'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'enter category'
                                            }
                                        ]}
                                    >
                                        <Input prefix={<BiCategory />} />
                                    </Form.Item>
                                    <Form.Item
                                        name={'isbn'}
                                        label={'ISBN Number'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'generate isbn number'
                                            }
                                        ]}
                                    >
                                        <Input prefix={<BsUpcScan onClick={generateISBN} />} />
                                    </Form.Item>
                                </div>
                            </div>
                            </Card>
                        </>
                    )}
                    {current === 2 && (
                        <>
                            <div style={{ padding: '6px 12px' }}>
                                <Title level={4} className='title-add'>
                                    Inventory Details
                                </Title>
                                <Text type="secondary" className='text-add'>
                                    Enter book stock and publishing information.
                                </Text>
                            </div>
                            <Card style={{background: '#171717', border:'none'}}>
                            <div style={{ margin: '6px 12px', }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 300px)',
                                    gap: '30px'
                                }}>
                                    <Form.Item
                                        name="total_copies"
                                        label="Total Copies"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter total copies'
                                            },
                                            {
                                                type: 'number',
                                                min: 1,
                                                message: 'Minimum 1 copy required'
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            min={1}
                                            style={{ width: '100%' }}
                                            prefix={<TbBooks />}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="available_copies"
                                        label="Available Copies"
                                        dependencies={['total_copies']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter available copies'
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {

                                                    if (
                                                        value == null ||
                                                        value <= getFieldValue('total_copies')
                                                    ) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(
                                                        new Error(
                                                            'Available copies cannot exceed total copies'
                                                        )
                                                    );
                                                }
                                            })
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: '100%' }}
                                            prefix={<MdOutlineLibraryBooks />}
                                        />
                                    </Form.Item>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 300px)',
                                    gap: '30px'
                                }}>
                                    <Form.Item
                                        name="total_pages"
                                        label="Total Pages"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter total pages'
                                            },
                                            {
                                                type: 'number',
                                                min: 1
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            min={1}
                                            style={{ width: '100%' }}
                                            prefix={<TbBooks />}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="rating"
                                        label="Rating"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter rating'
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            min={1.5}
                                            max={5}
                                            step={0.5}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 300px)',
                                    gap: '30px'
                                }}>
                                    <Form.Item
                                        name={'publish_date'}
                                        label="Publish Date"
                                    >
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="published_by"
                                        label="Published By"
                                    >
                                        <Input
                                            prefix={<BookOutlined />}
                                            placeholder="Enter publisher name"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            </Card>
                        </>
                    )}
                    {current === 3 && (
                        <>
                            <div style={{padding:'6px 12px'}}>
                                <Title level={4} className='title-add'>
                                    About Book
                                </Title>

                                <Text type="secondary" className='text-add'>
                                    Write a short and detailed description of your book.
                                </Text>
                            </div>
                            <Card style={{background: '#171717', border:'none'}}>
                            <div style={{margin:'6px 12px'}}>
                                <Form.Item
                                    name={'image'}
                                    label={'Image URL: '}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Enter image url'
                                        }
                                    ]}
                                >
                                    <Input 
                                        style={{width: '50%'}}
                                        placeholder="Enter image url"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="short_description"
                                    label="Short Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Enter short description'
                                        }
                                    ]}
                                >
                                    <Input style={{width: '50%'}}
                                        placeholder="Enter short description"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Enter book description'
                                        }
                                    ]}
                                >
                                    <TextArea
                                        style={{width: '50%'}}
                                        rows={5}
                                        placeholder="Enter book description"
                                    />
                                </Form.Item>
                            </div>
                            </Card>
                        </>
                    )}
                    <Divider />
                    <div style={{
                        display: 'flex', justifyContent: 'flex-end',
                        alignItems: 'center', gap: '20px', marginRight: '20px'
                    }}>
                        <Button disabled={current === 0}
                            htmlType="button"
                            style={{
                                width: '100px',
                                color: 'black',
                                background: '#C92D30',
                                borderColor: '#C92D30',
                            }}
                            onClick={previouseStep}
                        >
                            Previous
                        </Button>
                        {current === 3 ? (
                            <Button 
                            htmlType='button'
                            onClick={handleSubmit}
                            style={{
                                width: '100px',
                                color: 'black',
                                background: '#C92D30',
                                borderColor: '#C92D30',
                            }}>
                                Update Book
                            </Button>
                        ) : (
                            <Button
                            htmlType="button" 
                            onClick={nextStep} 
                            style={{
                                width: '100px',
                                color: 'black',
                                background: '#C92D30',
                                borderColor: '#C92D30',
                            }}>
                                Next
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default UpdateBook;