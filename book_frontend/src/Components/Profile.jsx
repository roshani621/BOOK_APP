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
import { getAPI } from '../APIS/api';
import API from '../APIS/endpoints';

const { Title, Text } = Typography;
const Profile = () => {

    const [user, setUser] = useState([]);
    const [requests, setRequests] = useState([]);
    const user_id = localStorage.getItem('b_user_id');
    const [counts, setCounts] = useState(0);
    const navigate = useNavigate();
    const role_id = localStorage.getItem("b_role_id");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await getAPI(`/user-profile/${user_id}`);
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
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };



    // const fetchRecords = async () => {
    //     try {
    //         const res = await getAPI(API.BOOKS_COUNT);
    //         setRequests(res.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    const fetchCount = async () => {
        try {
            const res = await getAPI(API.BOOKS_COUNT);
            console.log(res);
            setCounts(res.data);
        } catch (err) {
            console.log("something went wrong", err);
        }
    }

    useEffect(() => {
        fetchCount();
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
                        background: '#232323',
                        height: '240px',
                        borderRadius: '12px',
                        borderColor: '#3A3A3D'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <FaArrowLeft onClick={() => { navigate('/dashboard') }} style={{
                            cursor: 'pointer', color: '#fee2e2'
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
                                background: '#991b1b'
                            }}
                        >{getInitials(user.username)}</Avatar>
                        <div>
                            <Title level={4}>{user.username}</Title>
                            <Text style={{fontSize: '15px'}} className='profile-text'>{user.email}</Text>
                            <Tag style={{
                                background: '#991b1b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                width: '80px',
                                padding: '2px 4px',
                                margin: '5px',
                                justifyContent: 'center',
                                borderRadius: '12px',
                            }}>
                                <TbShieldCheck color='#fee2e2' />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}>
                                    <Text className='profile-text'>{user.role_name}</Text>
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
                            }}>{counts.total_request || 0}</Title>
                            <Title level={5} style={{ color: '#BFBFBF' }}>Total</Title>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: 'green'
                            }}>{counts.approved_requests || 0}</Title>
                            <Title level={5} style={{ color: '#BFBFBF' }}>Approved</Title>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: '#991b1b'
                            }}>{counts.reject_requests || 0}</Title>
                            <Title level={5} style={{ color: '#BFBFBF' }}>Rejected</Title>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <Title level={3} style={{
                                color: '#ea580c'
                            }}>{counts.pending_requests || 0}</Title>
                            <Title level={5} style={{ color: '#BFBFBF' }}>Pending</Title>
                        </Card>
                    </div>
                </div>
            </div>

            <div style={{textAlign: 'center'}}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card hoverable
                            style={{
                                margin: '10px 14px',
                                background: '#232323',
                                borderColor: '#3A3A3D',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}>
                                <Title className='t-text' level={5} type='secondary'>Account Info</Title>
                                <div className='card-inner-text'>
                                    <div className='card-inner'>
                                        <CiMail className='pr-icon' />
                                        <Title level={5} style={{ color: '#BFBFBF' }} type='secondary'>Email</Title>
                                    </div>
                                    <Text strong style={{ color: '#BFBFBF' }}>{user.email}</Text>
                                </div>

                                <div className='card-inner-text'>
                                    <div className='card-inner'>
                                        <FaPhone className='pr-icon' />
                                        <Title level={5} type='secondary' style={{ color: '#BFBFBF' }}>Phone</Title>
                                    </div>
                                    <Text style={{ color: '#BFBFBF' }} strong>{user.phone}</Text>
                                </div>

                                <div className='card-inner-text'>
                                    <div className='card-inner'>
                                        <CiCalendarDate className='pr-icon' />
                                        <Title style={{ color: '#BFBFBF' }} level={5} type='secondary'>Since</Title>
                                    </div>
                                    <Text style={{ color: '#BFBFBF' }} strong>{formatDate(user.created_at)}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card hoverable style={{
                            margin: '10px 14px',
                            background: '#232323',
                            borderColor: '#3A3A3D',padding: '10px 12px', margin: '8px 12px'
                        }}>
                            <Title level={5} className='t-text'>Library Activity</Title>
                            <div className='card-inner-text'>
                                <Title style={{ color: '#BFBFBF' }} level={5}>Borrowed Count</Title>
                                <Text style={{ color: '#BFBFBF' }}>{counts.borrow_count || 0}</Text>
                            </div>
                            <div className='card-inner-text'>
                                <Title style={{ color: '#BFBFBF' }} level={5}>Returned Count</Title>
                                <Text style={{ color: '#BFBFBF' }}>{counts.returened_count || 0}</Text>
                            </div>
                            <div className='card-inner-text'>
                                <Title style={{ color: '#BFBFBF' }} level={5}>Overdue Count</Title>
                                <Text style={{ color: '#BFBFBF' }}>{counts.overdue_count || 0}</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Profile;