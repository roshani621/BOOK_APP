import { Card, Typography, Input, Button, Modal } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const { Text, Title } = Typography;
const { TextArea } = Input;
const BorrowRequest = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remark, setRemark] = useState('');
    const [selectedId, setSelectedId] = useState({
        request_id: null,
        book_id: null
    });

    const fetchRequest = async () => {
        try {
            const res = await axios.get('http:////127.0.0.1:5000/borrow-request');
            console.log(res.data.request);
            setBooks(res.data.request);
        } catch (err) {
            console.log(err);
        }
    }

    const handleRejectClick = (request_id, book_id) => {
        setSelectedId({ request_id, book_id });
        setIsModalOpen(true)
    }

    const handleApproved = async (requestStatus, request_id, book_id) => {
        try {
            console.log(requestStatus, request_id, book_id);
            const user_id = localStorage.getItem("b_user_id");
            const res = await axios.post('http://127.0.0.1:5000/request', {
                request_status: requestStatus,
                request_id: request_id,
                user_id: user_id,
                book_id: book_id,
            });
            console.log(requestStatus, request_id, user_id, book_id);
            console.log(res.data);
            alert(res.data.message);
            fetchRequest();
        } catch (err) {
            console.log(err);
        }
    }

    const handleReject = async (requestStatus, request_id, book_id) => {
        try {
            if (!remark.trim()) {
                alert("please enter remrk for reject request");
                return;
            }
            const user_id = localStorage.getItem("b_user_id");
            const res = await axios.post('http://127.0.0.1:5000/request', {
                request_status: requestStatus,
                request_id: request_id,
                user_id: user_id,
                book_id: book_id,
                remark: remark
            });
            console.log(res.data);
            alert(res.data.message);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchRequest();
    }, [])
    return (
        <div>
            {books.length > 0 ? (
                books.map((book) => (
                        <Card hoverable>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                                gap: '10px',
                                fontWeight: '600px'
                            }}>
                                <Card>
                                    <img src={book.image} style={{
                                        width: '100%',
                                        height: '270px',
                                        objectFit: 'contain'
                                    }} />
                                </Card>
                                <Text>Author - {book.author}</Text>
                                <Text>Category - {book.category}</Text>
                                <Text>Username - {book.username}</Text>
                                <Text>Email - {book.email}</Text>
                                <Text>Borrow Days - {book.borrow_days}</Text>
                                <Text>Request Date - {book.request_date}</Text>
                                <div>
                                    <Button variant='solid' color='green'
                                        onClick={() => handleApproved("Approved", book.request_id, book.book_id)}
                                    >Approved</Button>
                                    <Button variant='solid' color='red' style={{
                                        marginLeft: '30px'
                                    }} onClick={() => handleRejectClick(book.request_id, book.book_id)}>Reject</Button>
                                </div>
                            </div>
                        </Card>
                    ))
    ): (<div>
        <Result
        title={<Title level={4}>No Pending requests</Title>}
        >
        </Result>
    </div>)}
        < Modal
                title='Reject Request'
            open={isModalOpen}
            onOk={() => handleReject("Rejected", selectedId.request_id, selectedId.book_id)}
            onCancel={() => setIsModalOpen(false)}
            >
            <Text>Please enter rejection remark:</Text>
            <TextArea
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder='Enter remark...'
            />
        </Modal>
        </div >
    );
};

export default BorrowRequest;