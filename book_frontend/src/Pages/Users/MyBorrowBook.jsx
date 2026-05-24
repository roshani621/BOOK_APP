import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, Tag, Badge, Divider, Rate } from 'antd';
import { FaCircleUser, FaClock, FaInbox } from "react-icons/fa6";
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
            const res = await axios.get('http://127.0.0.1:5000/borrow-records');
            console.log(res.data);
            setBorrows(res.data.request);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchUser = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/user-profile', {
                params: { user_id: user_id }
            });
            console.log(res.data.users);
            setUsers(res.data.users);
        } catch (err) {
            console.log(err);
        }
    }

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
        <div>
            <div>
                <Navtab onMenuClick={showDrawer} />
                <Sidebar open={open} onClose={closeDrawer} />
                <div>
                    <Card>
                        <Card.Meta
                            avatar={<Avatar icon={<FaCircleUser style={{ fontSize: '13pt' }} />} />}
                            title={<Text>Hii, {users.username} !</Text>}
                            description={<Text type='secondary'>{users.id} @Member</Text>}
                        />
                    </Card>
                </div>
                {myBook.length > 0 ? (
                    <div>
                        <Card>
                            <div style={{
                                display: 'flex', flexDirection: 'row',
                                justifyContent: 'space-around'
                            }}>
                                {[{ title: 'Total Count', value: totalCount, icon: <FaInbox color='#1E3A8A' /> },
                                { title: 'Pending Request', value: pendingCount, icon: <FaClock color='#D97706' /> },
                                { title: 'Approved Request', value: approvedCount, icon: <FaCheckCircle color='#16A34A' /> },
                                { title: 'Rejected Request', value: rejectCount, icon: <FaTimesCircle color='#DC2626' /> },
                                ].map((item, index) => (
                                    <Card hoverable style={{ width: '250px', background: '#fca5a5' }}>
                                        <div style={{
                                            width: '247px', height: '10px', background: '#dc2626',
                                            position: 'absolute', top: '0px', left: '0px', borderRadius: '10px'
                                        }}></div>
                                        <div style={{ fontSize: '20px' }}>{item.icon}</div>
                                        <Text type='secondary'>{item.title}</Text>
                                        <Title level={5}>{item.value}</Title>
                                    </Card>
                                ))}
                            </div>
                        </Card>

                        <div>
                            {["All", "Pending", "Approved", "Rejected"].map((status, index) => (
                                <Tag
                                    key={status}
                                    style={{
                                        cursor: 'pointer',
                                        color: selectedStatus === null ? '#fecaca' : '#991b1b',
                                        background: selectedStatus === null ? "#991b1b" : "#fecaca",
                                        fontSize: '13px', borderRadius: '12px', margin: '20px 10px'
                                    }}
                                    onClick={() => setSelectedStatus(status)}
                                >{status}</Tag>
                            ))}
                        </div>

                        {filterStatus.map((f, index) => (
                            <Card style={{background: '#fecaca', margin: '20px'}}>
                                <div style={{
                                    width: '7px',
                                    height: '100%',
                                    borderRadius: '12px',
                                    background: '#dc2626',
                                    position: 'absolute',
                                    top: '0%',
                                    left: '0%'
                                }} />
                                <Card style={{background: '#fecaca',borderColor: '#fecaca'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '20px'
                                    }}>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <div>
                                                <img src={f.image}
                                                    style={{
                                                        width: '100%',
                                                        height: '180px',
                                                        objectFit: 'contain',
                                                        borderRadius: '10px',
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <Title level={4}>{f.book_name}</Title>
                                                <Text>{f.description}</Text><br /><br />
                                                <Text style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px'
                                                }}>{f.author}
                                                    <div style={{
                                                        width: '5px',
                                                        height: '5px',
                                                        borderRadius: '50%',
                                                        background: '#b91c1c'
                                                    }} />
                                                    {f.category}
                                                </Text>
                                                <Text>Total Pages - {f.total_pages}</Text><br />
                                                <Text>Available Copies - {f.available_copies}</Text><br />
                                                <Text>{f.rating} 
                                                    <Rate disabled defaultValue={Number(f.rating)}
                                                    />
                                                </Text>
                                            </div>
                                        </div>
                                        <Tag style={{
                                            background: '#fca5a5',
                                            width: '70px',
                                            height: '22px',
                                            textAlign: 'center'
                                        }}>
                                            {f.status}
                                        </Tag>
                                    </div>
                                </Card>

                                <Card style={{
                                    background: '#fca5a5',
                                    borderColor: '#f87171', margin: '20px 20PX'
                                }}>
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '20px',
                                    }}>
                                        {[
                                            { label: 'REQUEST ID', value: f.book_id },
                                            { label: 'REQUESTED ON', value: new Date(f.request_date).toDateString() },
                                            { label: 'BORROW PERIOD', value: `${f.borrow_days} Days` },
                                            { label: 'EXPECTED DUE', value: new Date(f.due_date).toDateString() },
                                            { label: 'APPROVED DATE', value: f.approved_date ? new Date(f.approved_date).toLocaleDateString() : '-' },
                                            { label: 'RETURN DATE', value: f.return_date ? new Date(f.return_date).toLocaleDateString() : '-' }
                                        ].map((item, i) => (
                                            <div key={i} style={{
                                                padding: '12px',
                                                borderRadius: '10px'
                                            }}>
                                                <Text type='secondary'
                                                    style={{ color: '#dc2626' }}
                                                >{item.label}</Text>
                                                <Title level={5}
                                                    style={{ margin: 0, color: '#991b1b' }}>
                                                    {item.value}</Title>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                            </Card>
                        ))}
                    </div>
                ) : (<>Loading...</>)}
            </div>
        </div>
    );
};

export default MyBorrowBook;