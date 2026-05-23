import { Card, Typography, Input, Button, Modal, Result, Row, Col, Avatar } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { LuUserRound } from "react-icons/lu";
import { PiBooks } from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CiClock1 } from "react-icons/ci";
import '../../assets/Common.css';


const { Text, Title } = Typography;
const { TextArea } = Input;
const BorrowRequest = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remark, setRemark] = useState('');
    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const [selectedId, setSelectedId] = useState({
        request_id: null,
        book_id: null
    });

    const fetchRequest = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/borrow-request');
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

    const user_id = localStorage.getItem("b_user_id");
    console.log(user_id)

    const handleApproved = async (requestStatus, request_id, book_id) => {
        try {
            console.log(requestStatus, request_id, book_id);
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
        <div style={{ background: '#FAECE7' }}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ marginTop: '20px' }}>
                {books.length > 0 ? (
                    <>
                        {books.map((book) => (
                            <div>
                                <Row>
                                    <Col>
                                        <Card
                                            hoverable
                                            style={{
                                                borderRadius: '12px',
                                                background: '#FFFFFF',
                                                borderColor: '#E8C4B0',
                                                overflow: 'hidden',
                                                margin: '20px'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                gap: '20px',
                                                alignItems: 'stretch'
                                            }}>
                                                <div style={{
                                                    width: '7px',
                                                    minHeight: '100%',
                                                    background: '#D85A30',
                                                    border: '1px solid #D85A30',
                                                    position: 'absolute',
                                                    left: '0%',
                                                    top: '0%',
                                                    borderRadius: '18px'
                                                }} />


                                                <div style={{flex: '1'}}>
                                                    <Card>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            gap: '20px'
                                                        }}>
                                                            <div>
                                                                <img src={book.image} alt={book.title}
                                                                    style={{
                                                                        width: '100%', height: '180px', objectFit: 'contain',
                                                                        borderRadius: '12px'
                                                                    }} />
                                                            </div>

                                                            <div className='card-h'>
                                                                <Title level={4}>{book.book_name}</Title>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px'
                                                                }}>
                                                                    <Text className='text-h' type='secondary'>{book.author}</Text>
                                                                    <span style={{
                                                                        width: '6px',
                                                                        height: '6px',
                                                                        borderRadius: '50%',
                                                                        background: '#712B13',
                                                                        display:'inline-block'
                                                                    }}></span>
                                                                    <Text className='text-h' type='secondary'>{book.category}</Text>
                                                                </div>

                                                                <Card hoverable style={{
                                                                    borderRadius: '12px',
                                                                    background: '#F5C4B3',
                                                                    width: '500px'
                                                                }}>
                                                                    <div style={{
                                                                        display: 'flex', alignItems: 'center',
                                                                        gap: '20px'
                                                                    }}>
                                                                        <Avatar size={55} icon={<LuUserRound />} ></Avatar>
                                                                        <div style={{
                                                                            margin: '0px'
                                                                        }}>
                                                                            <Title level={5}>{book.username}</Title>
                                                                            <Text type='secondary'>{book.email}</Text>
                                                                        </div>
                                                                    </div>
                                                                </Card>
                                                            </div>

                                                        </div>
                                                    </Card>
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                                        gap: '20px',
                                                    }} className='request-card'>

                                                        <Card className='card'>
                                                            <div className='card-inner'>
                                                                <PiBooks className='icon' />
                                                                <Title level={5}>Available Copies</Title>
                                                            </div>
                                                            <div className='card-inner'>
                                                                <Title level={5}>{book.available_copies}</Title>
                                                                <Text className='text'>copies</Text>
                                                            </div>
                                                        </Card>

                                                        <Card className='card'>
                                                            <div className='card-inner'>
                                                                <LuCalendarDays className='icon' />
                                                                <Title level={5}>Borrow Days</Title>
                                                            </div>
                                                            <div className='card-inner'>
                                                                <Title level={5}>{book.borrow_days}</Title>
                                                                <Text className='text'>days</Text>
                                                            </div>
                                                        </Card>

                                                        <Card className='card'>
                                                            <div className='card-inner'>
                                                                <HiOutlineIdentification className='icon' />
                                                                <Title level={5}>Request ID</Title>
                                                            </div>
                                                            <div className='card-inner'>
                                                                <Title level={5}>{book.request_id}</Title>
                                                            </div>
                                                        </Card>

                                                        <Card className='card'>
                                                            <div className='card-inner'>
                                                                <LuCalendarDays className='icon' />
                                                                <Title level={5}>Request Date</Title>
                                                            </div>
                                                            <div className='card-inner'>
                                                                <Title level={5}>{book.request_date}</Title>
                                                            </div>
                                                        </Card>
                                                    </div>

                                                    <div style={{
                                                        marginTop: '30px'
                                                    }}>
                                                        <Card className='card'>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <div>
                                                                    <div className='card-inner'>
                                                                        <CiClock1 className='icon' />
                                                                        <Title level={5}>Created At</Title>

                                                                    </div>
                                                                    <Text strong className='text'>{book.created_at}</Text>

                                                                </div>
                                                                <div style={{ fontWeight: '800px' }}>
                                                                    <Button variant='solid' style={{
                                                                        borderColor: '#993C1D', color: 'green'
                                                                    }}
                                                                        onClick={() => handleApproved("Approved", book.request_id, book.book_id)}
                                                                    >Approved</Button>
                                                                    <Button variant='solid' style={{
                                                                        marginLeft: '30px', borderColor: '#993C1D',
                                                                        color: 'red'
                                                                    }} onClick={() => handleRejectClick(book.request_id, book.book_id)}>Reject</Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </>
                ) : (<div>
                    <Result
                        title={<Title level={4}>No Pending requests</Title>}
                    >
                    </Result>
                </div>)
                }
                <Modal
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
        </div >
    );
};

export default BorrowRequest;