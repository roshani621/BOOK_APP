import { Avatar, Result, Typography, Card, Divider, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdCheckCircle, MdOutlineMail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { HiOutlineIdentification } from "react-icons/hi2";
import { FiShield } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import Navtab from './Navtab';
import Sidebar from './Sidebar';

import '../assets/Common.css';

const { Title, Text } = Typography;
const {Meta} = Card;
const Profile = () => {

    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const user_id = localStorage.getItem('b_user_id');

    const [open, setOpen] = useState(false);
    
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    useEffect(() => {
        const fetchUserProfile = async (values) => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/user-profile/${user_id}`);
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



    const fetchRecords = async() =>{
        try{
            const res = await axios.get("http://127.0.0.1:5000/borrow-records");
            const newData = res.data.request;
            setRequests(newData);
            console.log(newData);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchRecords();
    },[]);
    return (
        <div style={{background: '#FAECE7'}}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            {user ? (
                <>
                    <div>
                        <Card hoverable style={{background: '#D85A30', borderRadius: '20px',
                            margin: '20px 20px'
                        }}>
                            <div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                
                                }}> 
                                    <div className='card-inner'>
                                        <Avatar size={90}>{getInitials(user.username)}</Avatar>
                                        <div>
                                            <Title level={4} style={{ color: 'white'}}>{user.username}</Title>
                                            <Text className='card-inner'
                                            style={{ color: 'white'}}
                                            ><MdOutlineMail /><Text style={{ color: 'white'}}>{user.email}</Text></Text>
                                            <Text className='card-inner' style={{ color: 'white'}}
                                            ><FaPhone /><Text style={{ color: 'white'}}>{user.phone}</Text></Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Text style={{ color: 'white'}}>{user.user_id}</Text>
                                        <div className='card-inner'>
                                            <Tag style={{
                                                borderRadius: '12px', display: 'flex', gap: '6px', alignItems: 'center'
                                            }}><MdCheckCircle color='#D85A30'/><Text strong style={{
                                                color: '#D85A30', fontSize: '10pt'
                                            }}>{user.status}</Text></Tag>
                                            <Tag style={{
                                                borderRadius: '12px', display: 'flex', gap: '6px', alignItems: 'center'
                                            }}><Text style={{color: '#D85A30'}} strong>{user.role_id}</Text></Tag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card 
                        style={{
                            margin: '20px 20px'
                        }}
                        hoverable title={<Title level={5} style={{color:'#D85A30',
                            background: '#F5C4B3', padding: '10px 10px', borderRadius: '12px',
                            margin:'10px'
                        }}>Account details</Title>}>
                            <Card style={{margin: '0px', padding: '0px'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }} className='card'>
                                    <div className='card-inner'>
                                        <MdOutlineMail className='icon'/>
                                        <Title level={5}>Email</Title>     
                                    </div>
                                    <Text className='text'>{user.email}</Text>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }} className='card'>
                                    <div className='card-inner'>
                                        <FaPhone className='icon'/>
                                        <Title level={5}>Phone</Title>     
                                    </div>
                                    <Text className='text'>{user.phone}</Text>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }} className='card'>
                                    <div className='card-inner'>
                                        <FiShield className='icon'/>
                                        <Title level={5}>Role</Title>     
                                    </div>
                                    <Text className='text'>{user.role_id} 
                                        <Tag color={'#993C1D'} style={{background: '#F5C4B3',
                                            borderRadius: '12px'
                                        }}> 
                                            <Text strong>  {user.role_name}</Text>    
                                        </Tag></Text>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }} className='card'>
                                    <div className='card-inner'>
                                        <CiCalendarDate className='icon' />
                                        <Title level={5}>Member Since</Title>     
                                    </div>
                                    <Text className='text'>{formatDate(user.created_at)}</Text>
                                </div>
                            </Card> 
                        </Card>
                        <Card
                        style={{
                            margin: '20px 20px'
                        }}
                         title={<Title style={{color: '#D85A30',
                            background: '#F5C4B3', padding: '10px 10px', borderRadius: '12px', margin: '10px'
                        }} level={5}>Recent Activity</Title>}>
                            {requests.map((request)=>(
                                <div style={{
                                    display: 'flex', alignItems:'center',
                                    justifyContent: 'space-between',
                                    padding: '10px'
                                }}>
                                    <div>
                                        <Title style={{color: '#993C1D'}} level={5}>{request.request_id} - {request.book_name}</Title>
                                    <div style={{display:'flex', alignItems: 'center', gap: '10px'}}>
                                        <Text style={{color: '#993C1D'}} >User {request.user_id} - {request.borrow_days} days</Text>
                                        <div style={{
                                                width: '5px',
                                                height:'5px',
                                                borderRadius: '50%',
                                                backgroundColor: '#993C1D'
                                            }}>
                                        
                                        </div>            
                                        <Text style={{color: '#993C1D'}} >Due {formatDate(user.created_at)}</Text>       
                                    </div>
                                    </div>
                                    <div>
                                        {request.status === 'Approved'? <Tag style={{background: '#F5C4B3',
                                            borderRadius: '12px'
                                        }}><Text
                                        style={{
                                            color: 'green'
                                        }}>Approved</Text></Tag>
                                        : request.status === 'Reject'? <Tag style={{background: '#F5C4B3',
                                            borderRadius: '12px'
                                        }}>
                                            <Text style={{color: 'red'}}>Rejected</Text>
                                        </Tag>: request.status === 'Pending'? <Tag style={{background: '#F5C4B3',
                                            borderRadius: '12px'
                                        }}>
                                            <Text style={{color: '#ea580c'}}>Pending</Text></Tag>:
                                        <Text>Request not found</Text>}
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>
                </>
            ) : (
                <div>
                    <Result
                        title={<Title level={4}>User not found!</Title>}
                    >
                    </Result>
                </div>
            )}
        </div>
    );
};

export default Profile;