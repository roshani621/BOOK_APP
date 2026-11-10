import { useState, useEffect } from 'react';
import { FaArrowLeft, FaRegUser, FaPhone  } from "react-icons/fa6";
import { TbShieldCheck } from "react-icons/tb";
import { Avatar, Card, Divider, Tag, Typography, Button} from 'antd';
import { CiMail } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { IoWarning } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import '../assets/Common.css';
import { getAPI } from '../APIS/api';
import { SlBookOpen } from "react-icons/sl";
import { SiBookstack } from "react-icons/si";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
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
        <div style={{ background: '#171717', minHeight:'140vh'}}>
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
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            margin: '12px 16px',
                            marginTop:'30px'
                        }}
                    >
                        <Card className='pr-card' hoverable>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div>
                                    <Avatar style={{ background: '#990000' }} size={46}><SiBookstack /></Avatar>
                                </div>
                                <div>
                                    <Title level={5} style={{ color: '#999999' }}>Total</Title>
                                    <Title level={3} style={{
                                        color: '#BFBFBF', marginTop: 0
                                    }}>{counts.borrow_count || 0}</Title>
                                </div>
                            </div>
                        </Card>

                        <Card className='pr-card' hoverable>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div>
                                    <FaCircleCheck style={{
                                        color: '#22C55E',

                                    }} size={40} />
                                </div>
                                <div>
                                    <Title level={5} style={{ color: '#999999' }}>Approved</Title>
                                    <Title level={3} style={{
                                        color: '#BFBFBF', marginTop: 0
                                    }}>{counts.approved_requests || 0}</Title>
                                </div>
                            </div>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div>
                                    <MdCancel size={40} style={{ color: '#f71c0c' }} />
                                </div>
                                <div>
                                    <Title level={5} style={{ color: '#999999' }}>Rejected</Title>
                                    <Title level={3} style={{
                                        color: '#BFBFBF', marginTop: 0
                                    }}>{counts.reject_requests || 0}</Title>

                                </div>
                            </div>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div>
                                    <Avatar style={{background: '#E98A0A'}}
                                    size={40}
                                    ><FiClock style={{paddingTop: '5px'}}/></Avatar>
                                </div>
                                <div>
                                    <Title level={5} style={{ color: '#999999' }}>Pending</Title>
                                    <Title level={3} style={{
                                        color: '#BFBFBF', marginTop: 0
                                    }}>{counts.pending_requests || 0}</Title>
                                </div>
                            </div>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div>
                                    <Avatar style={{background: 'red'}}
                                    size={40}
                                    ><IoWarning style={{paddingTop: '5px'}}/></Avatar>
                                </div>
                                <div>
                                    <Title level={5} style={{ color: '#999999' }}>Overdue</Title>
                                    <Title level={3} style={{
                                        color: '#BFBFBF', marginTop: 0
                                    }}>{counts.overdue_count || 0}</Title>
                                </div>
                            </div>
                        </Card>
                        <Card className='pr-card' hoverable>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div>
                                    <Avatar style={{background: '#6082B6'}}
                                    size={40}
                                    ><SlBookOpen style={{paddingTop: '10px'}} /></Avatar>
                                </div>
                                <div>
                                    <Title level={5} style={{ color: '#999999' }}>Returned</Title>
                                    <Title level={3} style={{
                                color: '#BFBFBF', marginTop: 0
                            }}>{counts.returned_count || 0}</Title>
                            
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div style={{
                textAlign: 'center',
                display: 'grid',
                gridTemplateColumns: '45% 45%',
                gap: '20px',
                justifyContent: 'center',
                marginTop:'30px'
            }}>
                <Card hoverable
                    style={{
                        background: '#232323',
                        borderColor: '#3A3A3D',
                        padding: '10px 12px', margin: '8px 12px',
                        borderRadius: '12px'
                    }}

                    title={
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center',
                            }}>
                                <Avatar
                                style={{background: '#991b1b'}}
                                ><FaRegUser style={{color: '#FFFFFF'}}/></Avatar>
                                <Title level={5}
                                style={{color:'#FFFFFF',
                                        fontWeight: 500, fontSize: '17px'
                                    }}
                                >Account Info</Title>
                            </div>
                            <Button style={{background: '#232323', borderColor: '#FFFFFF',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                
                            }}>
                                <GoPencil color='#FFFFFF' size={15}/> <Text 
                                style={{color:'#FFFFFF',
                                    fontWeight: 400, fontSize: '15px'
                                }} >Edit</Text>
                            </Button>
                        </div>
                        
                    }
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                        <div className='card-inner-text'>
                            <div className='card-inner'>
                                <CiMail className='pr-icon' />
                                <Title level={5} style={{ color: '#BFBFBF' }} type='secondary'>Email</Title>
                            </div>
                            <Text strong style={{ color: '#BFBFBF' }}>{user.email}</Text>
                        </div>
                        <Divider style={{borderColor: '#3a3a3a', margin : 3}}/>
                        <div className='card-inner-text'>
                            <div className='card-inner'>
                                <FaPhone className='pr-icon' />
                                <Title level={5} type='secondary' style={{ color: '#BFBFBF' }}>Phone</Title>
                            </div>
                            <Text style={{ color: '#BFBFBF' }} strong>{user.phone}</Text>
                        </div>
                        <Divider style={{borderColor: '#3a3a3a', margin : 3}}/>
                        <div className='card-inner-text'>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <CiCalendarDate style={{color: '#BFBFBF', }} size={25}/>
                                <Title style={{ color: '#BFBFBF' }} level={5} type='secondary'>Since</Title>
                            </div>
                            <Text style={{ color: '#BFBFBF' }} strong>{formatDate(user.created_at)}</Text>
                        </div>
                    </div>
                </Card>


                <Card hoverable style={{
                    background: '#232323', borderRadius: '12px',
                    borderColor: '#3A3A3D', padding: '10px 12px', margin: '8px 12px'
                }}
                title={
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <Avatar shape='square' size={40} style={{background: '#991b1b'}}
                        ><IoStatsChart size={20} style={{ color: '#FFF',
                            paddingTop: '5px'
                         }}/></Avatar>
                        <Title level={5} style={{ color: '#BFBFBF' }}>Library Activity</Title>

                    </div>
                }
                >
    
                    <div className='card-inner-text'>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Avatar shape='circle' size={15} style={{ background: '#f71c0c' }}></Avatar>
                            <Title style={{ color: '#BFBFBF' }} level={5}>Borrowed Count</Title>
                        </div>
                        <Text style={{ color: '#BFBFBF' }}>{counts.borrow_count || 0}</Text>
                    </div>
                    <Divider style={{borderColor: '#3a3a3a', margin : 3}}/>
                    <div className='card-inner-text'>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Avatar shape='circle' size={15} style={{ background: '#22C55E' }}></Avatar>
                            <Title style={{ color: '#BFBFBF' }} level={5}>Returned Count</Title>
                        </div>
                        <Text style={{ color: '#BFBFBF' }}>{counts.returned_count || 0}</Text>
                    </div>
                    <Divider style={{borderColor: '#3a3a3a', margin : 3}}/>
                    <div className='card-inner-text'>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Avatar shape='circle' size={15} style={{ background: '#E98A0A' }}></Avatar>
                            <Title style={{ color: '#BFBFBF' }} level={5}>Overdue Count</Title>
                        </div>
                        <Text style={{ color: '#BFBFBF' }}>{counts.overdue_count || 0}</Text>
                    </div>
                </Card>
            </div>
            </div>

            
        </div>
    );
};

export default Profile;