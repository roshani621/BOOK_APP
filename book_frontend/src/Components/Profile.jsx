import React from 'react';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { TbShieldCheck } from "react-icons/tb";
import { Avatar, Card, Space, Tag, Typography, Row, Col } from 'antd';
import { CiMail } from "react-icons/ci";
import axios from 'axios';
import { FaPhone } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import '../assets/Common.css';

const { Title, Text } = Typography;
const Profile = () => {

    const [user, setUser] = useState([]);
    const [requests, setRequests] = useState([]);
    const user_id = localStorage.getItem('b_user_id');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/user-profile/${user_id}`);
                console.log(res.data.user)
                setUser(res.data.user)
            } catch (err) {
                console.log(err);
            }
        }
        fetchUserProfile();
    }, []);

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const formatDate = (date) => {
        console.log(date);
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };



    const fetchRecords = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/borrow-records");
            const newData = res.data.request;
            const userRequest = newData.filter(
                req => req.user_id === user_id
            );
            setRequests(userRequest);
            console.log(newData);
        } catch (err) {
            console.log(err);
        }
    }

    const approvedCount = requests.filter(b => b.status === 'Approved').length;
    const rejectCount = requests.filter(b => b.status === 'Rejected').length;
    const pendingCount = requests.filter(b => b.status === 'Pending').length;

    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <div style={{ background: '#232323' }}>
            <div
                style={{
                    position: 'relative',
                    marginBottom: '120px',
                }}
            >
                <Card
                    className='profile-bg'
                    style={{
                        background: '#b91c1c',
                        height: '240px',
                        borderRadius: '12px'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <FaArrowLeft onClick={() => { navigate('/dashboard') }} style={{
                            cursor: 'pointer'
                        }} />
                        <Title level={4}>Profile</Title>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginTop: '20px'
                    }}>
                        <Avatar size={80} shape='circle'
                            style={{
                                borderColor: 'white', border: '3px solid #fee2e2',
                            }}
                        >{getInitials(user.username)}</Avatar>
                        <div>
                            <Title level={4}>{user.username}</Title>
                            <Text className='profile-text'>{user.email}</Text>
                            <Tag style={{
                                background: '#991b1b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                width: '120px',
                                borderRadius: '12px'
                            }}>
                                <TbShieldCheck color='#fee2e2' />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    <Text className='profile-text'>{user.role_name}</Text>
                                    <div style={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: '#fef2f2'
                                    }}></div>
                                    <Text className='profile-text'>{user.role_id}</Text>
                                </div>
                            </Tag>
                        </div>
                    </div>
                </Card>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            position: 'absolute',
                            bottom: '-280px',
                            top: '0',
                            left: '10%',
                        }}
                    >
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: 'red'
                            }}>{requests.length}</Title>
                            <Title level={5} style={{color: '#BFBFBF'}}>Total</Title>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: 'green'
                            }}>{approvedCount}</Title>
                            <Title level={5} style={{color: '#BFBFBF'}}>Approved</Title>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: '#991b1b'
                            }}>{rejectCount}</Title>
                            <Title level={5} style={{color: '#BFBFBF'}}>Rejected</Title>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: '#ea580c'
                            }}>{rejectCount}</Title>
                            <Title level={5} style={{color: '#BFBFBF'}}>Pending</Title>
                        </Card>
                    </div>
                </div>
            </div>
            <Card hoverable
                style={{
                    margin: '10px 14px',
                    background: '#232323'
                }}
                title={
                    <Title className='t-text' level={5} type='secondary'>Account Info</Title>
                }
            >
                <div>
                    <div

                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                        <div className='card-inner'>
                            <CiMail className='pr-icon' />
                            <Title level={5} style={{color: '#BFBFBF'}} type='secondary'>Email</Title>
                            <div style={{
                                marginLeft: '30px'
                            }}>
                                <Text strong style={{color: '#BFBFBF'}}>{user.email}</Text>
                            </div>
                        </div>
                        <div className='card-inner'>
                            <FaPhone className='pr-icon' />
                            <Title level={5} type='secondary' style={{color: '#BFBFBF'}}>Phone</Title>
                            <div style={{
                                marginLeft: '23px'
                            }}><Text style={{color: '#BFBFBF'}} strong>{user.phone}</Text></div>
                        </div>
                        <div className='card-inner'>
                            <CiCalendarDate className='pr-icon' />
                            <Title style={{color: '#BFBFBF'}} level={5} type='secondary'>Since</Title>
                            <div style={{
                                marginLeft: '30px'
                            }}>
                                <Text style={{color: '#BFBFBF'}} strong>{formatDate(user.created_at)}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card hoverable
                style={{
                    margin: '10px 14px',
                    marginTop: '40px',
                    background: '#2C2C2C'
                }}
                title={<Title type='secondary' style={{ color: '#b91c1c' }} level={5}>Activity timeline</Title>}
                extra={<Text strong style={{ color: '#b91c1c' }}>View all</Text>}
            >
                <Row>
                    <Col style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap:'12px'
                    }}>
                        {requests.map((request) => (
                            <Card style={{
                                padding: '2px 6px',
                                background: '#2C2C2C',
                                width: '80rem',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                    <div style={{
                                    display: 'flex',
                                    justifyContent: 'row',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background:
                                                request.status === 'Approved' ?
                                                    '#15803d' :
                                                    request.status === 'Rejected' ?
                                                        '#b91c1c' :
                                                        request.status === 'Pending' ?
                                                            '#f97316' :
                                                            '#991b1b'
                                        }}
                                    ></div>
                                    <Title className='t-text' level={5}>{request.book_name}</Title>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '5px',
                                    margin: '4px 6px'
                                }}>
                                    <Text style={{
                                        color: '#BFBFBF'
                                    }} type='secondary'>{request.book_id}</Text>
                                    <div className='dot'></div>
                                    <Text style={{
                                        color: '#BFBFBF'
                                    }} type='secondary'>{request.borrow_days} days</Text>
                                </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px'
                                }}>
                                    <Text className='t-text' type='secondary'>Due {formatDate(request.due_date)}</Text>
                                    <Text
                                        style={{
                                            color:
                                                request.status === 'Approved' ?
                                                    '#16a34a' :
                                                    request.status === 'Rejected' ?
                                                        '#b91c1c' :
                                                        request.status === 'Pending' ?
                                                            '#c2410c' :
                                                            '#991b1b',
                                            fontSize: '11pt',
                                            fontWeight: '500'
                                        }}
                                    >{request.status}</Text>
                                
                                </div>
                                </div>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Profile;