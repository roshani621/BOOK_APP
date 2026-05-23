import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, Tag, Badge, Divider } from 'antd';
import { FaCircleUser, FaClock, FaInbox } from "react-icons/fa6";
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const {Meta} = Card;
const {Text, Title} = Typography;
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
    const borrowBooks = async() =>{
        try{
            const res = await axios.get('http://127.0.0.1:5000/borrow-records');
            console.log(res.data);
            setBorrows(res.data.request);
        } catch(err){
            console.log(err);
        }
    }

    const fetchUser = async() =>{
        try{
            const res = await axios.get('http://127.0.0.1:5000/user-profile', {
                params: {user_id: user_id}
            });
            console.log(res.data.users);
            setUsers(res.data.users);
        } catch(err){
            console.log(err);
        }
    }

    const myBook = borrows.filter(b => b.user_id === user_id);

    const totalCount = myBook.length;
    const approvedCount = myBook.filter(b=> b.status === 'Approved').length;
    const rejectCount = myBook.filter(b=> b.status === 'Rejected').length;
    const pendingCount = myBook.filter(b=> b.status === 'Pending').length;

    const filterStatus = selectedStatus === "All" ? myBook : myBook.filter(b => b.status === selectedStatus);
    console.log(filterStatus);
    useEffect(()=>{
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
                        avatar={<Avatar icon={<FaCircleUser style={{fontSize: '13pt'}}/>}/>}
                        title={<Text>Hii, {users.username} !</Text>} 
                        description={<Text type='secondary'>{users.id} @Member</Text>}
                        />
                    </Card>
                </div>
                {myBook.length > 0 ? (
                    <div>
                            <Card>
                               <div style={{display: 'flex', flexDirection:'row',
                                justifyContent: 'space-around'
                               }}>
                                {[{title: 'Total Count', value: totalCount, icon: <FaInbox color='#1E3A8A'/>},
                                {title: 'Pending Request', value:pendingCount, icon: <FaClock  color='#D97706'/>},
                                {title: 'Approved Request', value:approvedCount, icon: <FaCheckCircle color='#16A34A'/>},
                                {title: 'Rejected Request', value:rejectCount, icon: <FaTimesCircle color='#DC2626'/>},
                               ].map((item, index)=>(
                                <Card hoverable style={{width: '250px', background: '#bae6fd'}}>
                                    <div style={{
                                        width: '247px', height: '10px', background: '#38bdf8',
                                        position: 'absolute', top: '0px', left: '0px', borderRadius: '10px'
                                    }}></div>
                                    <div style={{fontSize: '20px'}}>{item.icon}</div>
                                    <Text type='secondary'>{item.title}</Text>
                                    <Title level={5}>{item.value}</Title>
                                </Card>
                               ))}
                               </div>
                            </Card>
                            <Card>
                                {["All", "Pending", "Approved", "Rejected"].map((status, index)=>(
                                    <Tag
                                    key={status}
                                    style={{cursor: 'pointer',
                                        color: selectedStatus === null ? 'white' : '#7c3aed',
                                        background: selectedStatus === null ? "#7c3aed":"white",
                                        fontSize: '12pt', borderRadius: '12px'
                                    }}
                                    onClick={()=> setSelectedStatus(status)}
                                    >{status}</Tag>
                                ))}
                                <Card hoverable style={{
                                    boxShadow: '6px 6px 12px #d9d9d9, -6px -6px 12px #ffffff',
                                    marginTop: '10px'
                                }}>
                                    {filterStatus.map((f, index)=>(
                                        <div>
                                        <Card hoverable style={{background: '#eef2f8', margin:'20px',
                                        }}>
                                            <div style={{
                                                width: '10px', height: '350px', borderRadius: '0%',
                                                background: '#60a5fa',borderRadius: '20px',
                                                position: 'absolute', left: '0px', top: '0px'
                                            }}></div>
                                            <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                                                <img src={f.image} style={{
                                                    widows: '100%', height: '150px', objectFit: 'contain'
                                                }}/>
                                                <Meta 
                                                title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Title level={4}>{f.book_name}</Title>
                                                    <Tag
                                                    variant='filled'
                                                    style={{
                                                        borderRadius: '8px',
                                                        width: '60px',
                                                        height: '20px',
                                                        marginLeft: '850px',
                                                        background:
                                                        f.status === "Approved"
                                                            ? "#DCFCE7"
                                                            : f.status === "Rejected"
                                                            ? "#FEE2E2"
                                                            : f.status === "Pending"
                                                            ? "#FEF3C7"
                                                            : "#F3F4F6",
                                                        color:
                                                        f.status === "Approved"
                                                            ? "#166534"
                                                            : f.status === "Rejected"
                                                            ? "#7F1D1D"
                                                            : f.status === "Pending"
                                                            ? "#92400E"
                                                            : "#374151"
                                                    }}
                                                        >
                                                        {f.status}
                                                    </Tag>
                                                    </div>}
                                                description={
                                                    <>
                                                    <div>
                                                        <Text>{f.description}</Text>
                                                    </div>
                                                    <div>
                                                        <Text>{f.author}</Text>
                                                        <Badge color='purple' text={f.category} style={{
                                                            marginLeft: '20px'
                                                        }}/>
                                                    </div>
                                                    <div><Text>Total Pages - {f.total_pages}</Text></div>
                                                    <div><Text>Available Copies - {f.available_copies}</Text></div>
                                                    </>
                                                }
                                            />
                                            </div>

                                            <div>
                                                    <Meta 
                                                description={
                                                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
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
                                                            <Text type='secondary'>{item.label}</Text>
                                                            <Title level={5} style={{ margin: 0, }}>{item.value}</Title>
                                                            </div>
                                                        ))}     
                                                    </div>
                                                }
                                                />
                                            </div>
                                        </Card>
                                        </div>
                                    ))}
                                </Card>

                                
                            </Card>
                        </div>
                ):(<>Loading...</>)}
            </div>
        </div>
    );
};

export default MyBorrowBook;