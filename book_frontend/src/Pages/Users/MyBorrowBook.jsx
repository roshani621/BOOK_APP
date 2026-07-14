import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, Tag, Badge, Divider, Rate } from 'antd';
import { FaCircleUser, FaClock, FaInbox } from "react-icons/fa6";
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { getAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';

const { Meta } = Card;
const { Text, Title } = Typography;
const MyBorrowBook = () => {

    const [borrows, setBorrows] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [open, setOpen] = useState(false);

    const showBookDrawer = () => setBookDrawer(true);
    const closeBookDrawer = () => setBookDrawer(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const user_id = localStorage.getItem("b_user_id");
    const borrowBooks = async () => {
        try {
            const res = await getAPI(API.BORROW_RECORDS);
            setBorrows(res.data.request);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchUser = async () => {
        try {
            const res = await getAPI(`${API.USER_PROFILE}/${user_id}`)
            setUsers(res.data.user)
        } catch (err) {
            console.log(err);
        }
    }

    const formatDate = (date) => {
        console.log(date);
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const myBook = borrows.filter(b => b.user_id === user_id);

    const totalCount = myBook.length;
    const approvedCount = myBook.filter(b => b.status === 'Approved').length;
    const rejectCount = myBook.filter(b => b.status === 'Rejected').length;
    const pendingCount = myBook.filter(b => b.status === 'Pending').length;

    const filterStatus = selectedStatus === "All" ? myBook : myBook.filter(b => b.status === selectedStatus);
    console.log(filterStatus);
    useEffect(() => {
        borrowBooks();
        fetchUser();
    }, []);
    return (
        <div className='layout-bg'>
            <div>
                <Navtab onMenuClick={showDrawer} />
                <Sidebar open={open} onClose={closeDrawer} />
                <div>
                    <Card style={{ background: '#2C2C2C',marginBottom: '40px', borderColor: '#2C2C2C'}}>
                        <div style={{
                            display:'flex',
                            flexDirection: 'column',
                            gap:'10px'
                        }}>
                            <div style={{
                            display:'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap:'10px',
                            
                        }}>
                                <Avatar icon={<FaCircleUser style={{ fontSize: '13pt' }} />} />
                                <Text style={{
                                    color: '#ffffff', fontWeight: '600'
                                }}>Hii, {users.username} !</Text>
                            </div>
                            <Text style={{
                                    color: '#ffffff'
                                }} type='secondary'>{users.id} @Member</Text>
                        </div>
                    
                    
                            <div style={{
                                display: 'flex', flexDirection: 'row',
                                justifyContent: 'space-around', marginTop: '30px',
                                
                            }}>
                                {[{
                                    title: 'Total Count', value: totalCount, icon: <FaInbox color='#4338ca' />,
                                    color: '#2563eb', text: 'All requests'
                                },
                                {
                                    title: 'Pending Request', value: pendingCount, icon: <FaClock color='#D97706' />,
                                    color: '#F59E0B', text: 'Awaiting approval'
                                },
                                {
                                    title: 'Approved Request', value: approvedCount, icon: <FaCheckCircle color='#16A34A' />,
                                    color: '#22C55E', text: 'Approved by admin'
                                },
                                {
                                    title: 'Rejected Request', value: rejectCount, icon: <FaTimesCircle color='#DC2626' />,
                                    color: '#EF4444', text: 'Not approved'
                                },
                                ].map((item, index) => (
                                    <Card hoverable style={{ width: '250px', position: 'relative', 
                                    background: '#1f2937',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)', overflow: 'hidden',
                                    borderRadius: '16px',  }}>
                                        <div style={{
                                            width: '100%',
                                            height: '6px',
                                            background: item.color,
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            borderRadius: '12px 12px 0 0',
                                            
                                        }}></div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '20px',
                                            fontWeight: '600'
                                        }}>
                                            <Avatar >{item.icon}</Avatar>
                                            <Title style={{
                                                color:'#ffffff'
                                            }} level={5} type='secondary'>{item.title}</Title>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            fontWeight: '500'
                                        }}>
                                            <Title style={{
                                                color:'#ffffff'
                                            }} level={5}>{item.value}</Title>
                                            <Text style={{
                                                color:'#ffffff'
                                            }} type='secondary'>{item.text}</Text>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            
                        </Card>
                </div>
                {myBook.length > 0 ? (
                    <div>
                        <div>
                            {["All", "Pending", "Approved", "Rejected"].map((status, index) => (
                                <Tag
                                    key={status}
                                    style={{
                                        cursor: 'pointer',
                                        color: selectedStatus === status ? '#ffffff' : '#d1d5db',
                                        background: selectedStatus === status ? '#dc2626' : '#3f3f46',
                                        fontSize: '13px', borderRadius: '999px', padding: '4px 12px',
                                        fontWeight: '500px', margin: '10px'
                                    }}
                                    onClick={() => setSelectedStatus(status)}
                                >{status}</Tag>
                            ))}
                        </div>

                        {filterStatus.map((f, index) => (
                            <Card hoverable
                                style={{
                                    height: '190px',
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    margin: '12px 24px',
                                    marginTop: '50px',
                                    background: '#2C2C2C'
                                }}

                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '20px'
                                }}>
                                    <div style={{
                                        width: '6px',
                                        height: '100%',
                                        position: 'absolute',
                                        background:
                                            f.status === 'Approved' ?
                                                '#16a34a' :
                                                f.status === 'Rejected' ?
                                                    '#dc2626' :
                                                    f.status === 'Pending' ?
                                                        '#f97316' :
                                                        '#ef4444',
                                        left: '0',
                                        top: '0'

                                    }}></div>
                                    <div style={{
                                        display: 'flex',
                                        flex: '1',
                                        gap: '20px'
                                    }}>
                                        <img
                                            src={f.image}
                                            alt={f.book_name}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '130px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                flexShrink: 0
                                            }}
                                        />
                                        <div>
                                            <Title className='t-text' level={4}>{f.book_name}</Title>
                                            <Text className='t-text' style={{fontWeight: '400'}} type='secondary'>{f.author}</Text><br />
                                            <Text className='t-text' style={{fontWeight: '400'}} type='secondary'>{f.description}</Text><br />
                                            <Tag style={{
                                                color: '#4f46e5',
                                                background: '#c7d2fe',
                                                borderRadius: '8px',
                                                fontWeight: '500px',
                                                marginTop: '15px'
                                            }}>{f.category}</Tag>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <Tag
                                            style={{
                                                color:
                                                    f.status === 'Approved' ?
                                                        '#16a34a' :
                                                        f.status === 'Rejected' ?
                                                            '#dc2626' :
                                                            f.status === 'Pending' ?
                                                                '#f97316' :
                                                                '#ef4444',

                                                background:
                                                    f.status === 'Approved' ?
                                                        '#bbf7d0' :
                                                        f.status === 'Rejected' ?
                                                            '#fecaca' :
                                                            f.status === 'Pending' ?
                                                                '#fed7aa' :
                                                                '#fecaca',

                                                fontWeight: '600',
                                                fontSize: '12px',
                                                borderRadius: '12px',
                                                height: '25px',
                                                width: '86px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background:
                                                    f.status === 'Approved' ?
                                                        '#16a34a' :
                                                        f.status === 'Rejected' ?
                                                            '#dc2626' :
                                                            f.status === 'Pending' ?
                                                                '#f97316' :
                                                                '#ef4444',
                                            }}></div>
                                            {f.status}</Tag>

                                        <Text type='secondary' style={{
                                            fontWeight: '500',
                                            color: '#fff'
                                        }}>
                                            <CiCalendarDate className='t-text' size={16} style={{
                                                fontWeight: '500'
                                            }} /> Due {formatDate(f.due_date)}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (<>Loading...</>)}
            </div>
        </div>
    );
};

export default MyBorrowBook;