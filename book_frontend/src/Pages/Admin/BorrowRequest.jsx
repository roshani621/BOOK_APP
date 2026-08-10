import { Card, Typography, Input, Button, Modal, Result, Row, Col, Avatar, Tag, Divider, Badge,
    notification
 } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CiClock1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";

import '../../assets/Common.css';
import { IoNotifications, IoNotificationsOutline } from 'react-icons/io5';
import { getAPI, postAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';


const { Text, Title } = Typography;
const { TextArea } = Input;
const BorrowRequest = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remark, setRemark] = useState('');
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const [selectedId, setSelectedId] = useState({
        request_id: null,
        book_id: null
    });

    const fetchRequest = async () => {
        try {
            const res = await getAPI(API.BORROW_REQUEST);
            console.log(res.data.request);
            setBooks(res.data.request);

            const pendingCount = res.data.request.filter(
                item=> item.status === 'Pending'
            ).length;
            setCount(pendingCount);
            console.log(pendingCount)
        } catch (err) {
            console.log(err);
        }
    }

    const handleRejectClick = (request_id, book_id) => {
        setSelectedId({ request_id, book_id });
        setIsModalOpen(true)
    }

    const user_id = localStorage.getItem("b_user_id");

    const handleApproved = async (requestStatus, request_id, book_id) => {
        try {
            console.log(requestStatus, request_id, book_id);
            const res = await postAPI(API.REQUEST, {
                request_status: requestStatus,
                request_id: request_id,
                user_id: user_id,
                book_id: book_id,
            });
            console.log(requestStatus, request_id, user_id, book_id);
            console.log(res.data);
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
            const res = await postAPI(
                API.REQUEST, 
                {
                    request_status: requestStatus,
                    request_id: request_id,
                    user_id: user_id,
                    book_id: book_id,
                    remark: remark
            });
            console.log(res.data);
            setIsModalOpen(false);
            setRemark('');
            fetchRequest();
        } catch (err) {
            console.log(err);
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    console.log(count)

    useEffect(() => {
        fetchRequest();
    }, [])
    return (
        <div className='layout-bg'>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ marginTop: '20px', background: '#2C2C2C'  }}>
                {books.length > 0 ? (
                    <>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '10px 20px',
                            gap: '10px'
                        }}>
                            <Title style={{color: '#ffffff'}} level={5}>Borrow Request</Title>
                           <Badge count={count} size='small'>  
                            <IoNotificationsOutline size={24}
                                style={{ color: "#fff", cursor: "pointer" }}/>
                           </Badge>
                        </div>
                        {books.map((book) => (
                            <Row>
                                <Col span={24}>
                                    <Card hoverable style={{
                                        width: '90em', background: '#2C2C2C',
                                        margin: '20px 40px', position: 'relative', borderRadius: '12px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            width: '8px',
                                            height: '100%',
                                            background: '#dc2626',
                                            top: '0',
                                            left: '0',
                                            borderRadius: '12px'
                                        }}></div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            padding: '20px',
                                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                            borderRadius: '12px',
                                            borderLeftColor: '#dc2626'

                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',

                                            }}>
                                                <div><img src={book.image} alt={book.book_name}
                                                    style={{
                                                        width: '90px',
                                                        height: '130px',
                                                        objectFit: 'cover',
                                                        borderRadius: '16px'
                                                    }}
                                                /> </div>
                                                <div>
                                                    <Title style={{ color: 'white' }} level={4}>{book.book_name}</Title>
                                                    <Text style={{ color: 'white' }}
                                                        type='secondary'>{book.author}</Text>
                                                    <div className='br-card-head' style={{
                                                        marginTop: '20px'
                                                    }}>
                                                        <Tag
                                                            style={{
                                                                borderRadius: '12px',
                                                                borderColor: '#fca5a5',
                                                                backgroundColor: '#fca5a5',
                                                                color: '#991b1b',
                                                                fontWeight: '600'
                                                            }}
                                                        >{book.category}</Tag>
                                                        <Tag style={{
                                                            borderRadius: '12px',
                                                            backgroundColor: '#232323',
                                                            color: '#ffffff',
                                                            fontWeight: '600',
                                                        }}>{book.available_copies} copies available</Tag>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Tag
                                                    style={{
                                                        borderColor: '#fca5a5',
                                                        backgroundColor: '#fca5a5',
                                                        color: '#991b1b',
                                                        fontWeight: '600',
                                                        borderRadius: '12px'
                                                    }}
                                                >
                                                    {book.status}
                                                </Tag>
                                            </div>
                                        </div>

                                        <Card hoverable style={{
                                            margin: '10px 20px',
                                            backgroundColor: '#232323',
                                            borderColor: '#232323',
                                            height: '80px',
                                            padding: '10px 20px',
                                            marginTop: '20px'
                                        }} bodyStyle={{ padding: '0' }}>
                                            <div className='br-card-head'>
                                                <div>
                                                    <Avatar size={50}>
                                                        <Text strong type='secondary' style={{
                                                            color: '#dc2626', textAlign: 'center'
                                                        }}
                                                        >{getInitials(book.username)}</Text></Avatar>
                                                </div>
                                                <div style={{
                                                    margin: '0px',
                                                    padding: '0px'
                                                }}>
                                                    <Title style={{ color: '#ffffff' }} level={5}>{book.username}</Title>
                                                    <Text style={{ color: '#ffffff' }} >{book.email}</Text>
                                                </div>
                                            </div>
                                        </Card>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '20px',
                                            marginTop: '30px'
                                        }}>
                                            <Card hoverable style={{
                                                backgroundColor: '#232323',
                                                borderColor: '#232323',
                                            }}>
                                                <div className='br-card-head'>
                                                    <HiOutlineDocumentText color='#ffffff' />
                                                    <Text style={{
                                                        color: '#ffffff'
                                                    }} type='secondary' strong>REQUEST</Text>
                                                </div>
                                                <Title style={{
                                                    color: '#ffffff'
                                                }} level={5}>{book.request_id}</Title>
                                            </Card>
                                            <Card hoverable style={{
                                                backgroundColor: '#232323',
                                                borderColor: '#232323',
                                            }}>
                                                <div className='br-card-head'>
                                                    <CiCalendarDate color='#ffffff' />
                                                    <Text style={{
                                                        color: '#ffffff'
                                                    }} type='secondary' strong>DURATION</Text>
                                                </div>
                                                <Title style={{
                                                    color: '#ffffff'
                                                }} level={5}>{book.borrow_days} days</Title>
                                            </Card>
                                            <Card hoverable style={{
                                                backgroundColor: '#232323',
                                                borderColor: '#232323',
                                            }}>
                                                <div className='br-card-head'>
                                                    <CiCalendarDate color='#ffffff' />
                                                    <Text style={{
                                                        color: '#ffffff'
                                                    }} type='secondary' strong>DUE</Text>
                                                </div>
                                                <Title style={{
                                                    color: '#ffffff'
                                                }} level={5}>{formatDate(book.due_date)}</Title>
                                            </Card>
                                        </div>

                                        <Card hoverable style={{
                                            backgroundColor: '#232323',
                                            borderColor: '#232323',
                                            marginTop: '30px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '10px',
                                                margin: '12px 16px'
                                            }}>
                                                <div className='br-card-head'>
                                                    <CiClock1 color='#ffffff' />
                                                    <Text style={{
                                                        color: '#ffffff'
                                                    }}>{book.created_at}</Text>
                                                </div>

                                                <div className='br-card-head'>
                                                    <Button style={{
                                                        background: '#232323',
                                                        color: '#ffffff',
                                                        fontWeight: '500'
                                                    }}
                                                    onClick={()=>
                                                        handleRejectClick(
                                                            book.request_id,
                                                            book.book_id
                                                        )
                                                    }
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button style={{
                                                        background: '#dc2626',
                                                        color: '#ffffff',
                                                        fontWeight: '500'
                                                    }}
                                                    onClick={()=>
                                                        handleApproved(
                                                            "Approved",
                                                            book.request_id,
                                                            book.book_id
                                                        )
                                                    }
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>

                                    </Card>
                                </Col>
                            </Row>
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