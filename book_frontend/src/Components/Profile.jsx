import { useState, useEffect } from 'react';
import { FaArrowLeft, FaRegUser, FaPhone, FaBookOpen, FaUsers } from "react-icons/fa6";
import { TbShieldCheck } from "react-icons/tb";
import { Avatar, Card, Divider, Tag, Typography, Button, Row, Col, Progress } from 'antd';
import { CiMail } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { IoWarning } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import '../assets/Common.css';
import { getAPI } from '../APIS/api';
import { LuBookCopy } from "react-icons/lu";
import { MdCollectionsBookmark } from "react-icons/md";

import { SlBookOpen } from "react-icons/sl";
import { SiBookstack } from "react-icons/si";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";

import API from '../APIS/endpoints';

const { Title, Text } = Typography;
const { Meta } = Card;
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

    const fetchCount = async () => {
        try {
            const res = await getAPI(API.BOOKS_COUNT);
            console.log(res);
            setCounts(res.data);
        } catch (err) {
            console.log("something went wrong", err);
        }
    }

    const fetchPopularBooks = async () => {
        try {
            const res = await getAPI(API.POPULAR_BOOKS);
            console.log(res);
            setRequests(res.data);
        } catch (err) {
            console.log("something went wrong", err);
        }
    }

    useEffect(() => {
        fetchCount();
    }, []);

    useEffect(()=>{
        fetchPopularBooks();
    },[]);

    return (
        <div style={{ background: '#171717', minHeight: '140vh' }}>
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
                        borderRadius: '12px',
                        borderColor: '#383838'
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
                            <Text style={{ fontSize: '15px' }} className='profile-text'>{user.email}</Text>
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

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 300px)',
                    justifyContent: 'center', gap: '30px', margin: '30px'
                }}>
                    <Card style={{
                        background: '#232323', borderRadius: '12px',
                        borderColor: '#3A3A3D',
                    }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Avatar size={60} style={{
                                color: '#DC2626', borderColor: '#681F25',
                                background: '#291719', paddingTop: '10px'
                            }}><FaBookOpen size={30} /></Avatar>
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                            }}>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.total_books}</Title>
                                <Text style={{ color: '#BFBFBF' }}>Total Book Copies</Text>
                            </div>
                        </div>
                    </Card>
                    <Card style={{
                        background: '#232323', borderRadius: '12px',
                        borderColor: '#3A3A3D',
                    }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Avatar size={60} style={{
                                color: '#DC2626', borderColor: '#681F25',
                                background: '#291719', paddingTop: '10px'
                            }}><LuBookCopy size={30} /></Avatar>
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                            }}>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.available_books}</Title>
                                <Text style={{ color: '#BFBFBF' }}>Available Book Copies</Text>
                            </div>
                        </div>
                    </Card>
                    <Card style={{
                        background: '#232323', borderRadius: '12px',
                        borderColor: '#3A3A3D',
                    }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Avatar size={60} style={{
                                color: '#DC2626', borderColor: '#681F25',
                                background: '#291719', paddingTop: '10px'
                            }}><MdCollectionsBookmark size={30} /></Avatar>
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                            }}>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.books_count}</Title>
                                <Text style={{ color: '#BFBFBF' }}>Total Books Count</Text>
                            </div>
                        </div>
                    </Card>
                    <Card style={{
                        background: '#232323', borderRadius: '12px',
                        borderColor: '#3A3A3D',
                    }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Avatar size={60} style={{
                                color: '#DC2626', borderColor: '#681F25',
                                background: '#291719', paddingTop: '10px'
                            }}><IoDocumentTextOutline size={30} /></Avatar>
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                            }}>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.total_borrow}</Title>
                                <Text style={{ color: '#BFBFBF' }}>Total Requests</Text>
                            </div>
                        </div>
                    </Card>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems:'center'}}>
                    <Card style={{
                        background: '#232323', borderRadius: '12px',
                        borderColor: '#3A3A3D',
                    }}>
                        <Title level={4} style={{ color: '#FFFFFF' }}>Borrow Request Overview</Title>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 300px)',
                            gap: '15px'
                        }}>
                            <Card style={{
                                background: '#232323', borderRadius: '12px',
                                borderColor: '#3A3A3D',
                            }}>
                                <Text style={{ color: '#e8b339' }}>Pending</Text>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.pending_requests}</Title>
                            </Card>
                            <Card style={{
                                background: '#232323', borderRadius: '12px',
                                borderColor: '#3A3A3D',
                            }}>
                                <Text style={{ color: '#49aa19' }}>Approved</Text>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.approved_requests}</Title>
                            </Card>
                            <Card style={{
                                background: '#232323', borderRadius: '12px',
                                borderColor: '#3A3A3D',
                            }}>
                                <Text style={{ color: '#d32029' }}>Rejected</Text>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.reject_requests}</Title>
                            </Card>
                            <Card style={{
                                background: '#232323', borderRadius: '12px',
                                borderColor: '#3A3A3D',
                            }}>
                                <Text style={{ color: '#263ea0' }}>Returned</Text>
                                <Title level={4} style={{ color: '#FFFFFF' }}>{counts.returned_count}</Title>
                            </Card>
                        </div>
                    </Card>

                    <Card style={{
                        background: '#232323', borderRadius: '12px',
                        borderColor: '#3A3A3D', width: '600px'
                    }}>
                        <Title level={4} style={{color: '#FFFFFF'}}>Most Popular Books</Title>
                        <Text style={{color: '#BFBFBF'}}>Books ranked by total borrow requests</Text>
                        {requests.map((request)=>(
                            <div style={{marginTop: '12px',}}>
                                <Title style={{color: '#FFFFFF'}} level={5}>{request.book_name}</Title>
                                <Text style={{color: '#BFBFBF'}}>{request.author}</Text><br />
                                <Progress percent={request.total_requests} showInfo={false}
                                style={{width: '300px'}}
                                />
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </div>



    );
};

export default Profile; 