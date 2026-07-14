import { useEffect, useState } from 'react';
import Navtab from './Navtab';
import Sidebar from './Sidebar';
import axios from 'axios';
import { TbBooks } from 'react-icons/tb';
import { Avatar, Typography, Tag, Card, Rate, Button, Divider } from 'antd';

import { FaFire } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { BsLightbulbFill } from "react-icons/bs";
import { MdOutlineAutoStories } from "react-icons/md";


const { Title, Text } = Typography;

const Notification = () => {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [selectCategory, setSelectCategory] = useState("All")
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/notification');
            setNotifications(res.data.notification);
            console.log(res.data.notification);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const category = ["All", ...new Set(notifications.map(n => n.category))];

    const categoryIcons = {
        "Trending": <FaFire />,
        "New Arrivals": <MdLibraryAdd />,
        "Overdue Books": <MdOutlineAccessTimeFilled />,
        "Suggestions": <BsLightbulbFill />,
        "Book Updates": <MdOutlineAutoStories />
    };

    const renderNotification = (n) =>{
        switch(n.category){
            case "Book Updates":
                return(
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Title level={5} style={{color: '#BFBFBF'}}>{n.message}</Title>
                            <Tag color={'green'} style={{borderRadius: '999px'}}>{n.status}</Tag>
                        </div>

                        <div>
                            <Text style={{color: '#BFBFBF'}}><b>Author: </b>{n.author}</Text>
                            <br />
                            <Text style={{ color: '#BFBFBF' }}>
                                <b>Available Copies:</b> {n.available_copies}/{n.total_copies}
                            </Text>
                            <br />
                            <Text style={{color: '#BFBFBF'}}>{n.rating}</Text> 
                            <Rate value={Number(n.rating)} disabled allowHalf style={{
                                marginTop: '7px',  marginLeft: '7px'
                            }}/>      
                        </div>
                    </>
                )
            case "Overdue Books":
                return(
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Title level={5} style={{color: '#BFBFBF'}}>{n.message}</Title>
                            <Tag color={'red'} style={{borderRadius: '999px'}}>{n.status}</Tag>
                        </div>

                        <div>
                            <Text style={{color: '#BFBFBF'}}><b>Member: </b>{n.member_name}</Text>
                            <br />
                            <Text style={{color: '#BFBFBF'}}>
                                <b>Book:</b> {n.book_name}
                            </Text>
                            <br />
                            <Text style={{color: '#BFBFBF'}}>
                                <b>Fine: </b> {n.fine}
                            </Text>
                            <br />
                            {n.actions.map((action)=>(
                                <Button
                                style={{
                                    marginRight: '8px',
                                    background: action === 'Send Reminder'?
                                    '#dc2626' : '#3b82f6', color: '#FFF',
                                    fontWeight: '600', border: 'none'
                                }}
                                >{action}</Button>
                            ))}
                        </div>
                    </>
                )
            case "Suggestions":
                return (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Title level={5} style={{color: '#BFBFBF'}}>{n.message}</Title>
                            <Tag color="purple" style={{borderRadius: '999px'}}>{n.status}</Tag>
                        </div>
                        <br />
                        <Title level={5} style={{color: '#BFBFBF'}}><b>Book</b>: {n.book_name}</Title> 
                        <Title level={5} style={{color: '#BFBFBF'}}><b>Author</b>: {n.author}</Title><br />
                    </>
                );
            case "New Arrivals":
                return (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Title level={5} style={{color: '#FFF'}}>{n.message}</Title>
                            <Tag color="green" style={{borderRadius: '999px'}}>{n.status}</Tag>
                        </div>

                        <br /><br />

                        {n.category === 'New Arrivals' && (
                            <div>
                                {n.books?.map((book, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            color: "#fff",
                                            padding: "8px 12px",
                                            background: "#3b3b3b",
                                            borderRadius: "8px",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        📚 {book}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <br />
                        {n.actions.map((action)=>(
                                <Button
                                style={{
                                    marginRight: '10px', marginTop: '10px',
                                    fontWeight: '600', border: 'none',
                                    background: action === 'View Arrivals'?
                                    'green': '#dc2626',
                                    color: "#fff",
                                }}
                                >{action}</Button>
                            ))}
                    </>
                );
            case "Trending":
                return (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Title level={5} style={{color: '#FFF'}}>{n.message}</Title> 

                            <Tag color="orange" style={{borderRadius: '999px'}}>{n.status}</Tag>
                        </div>

                        <Title level={5} style={{color: '#FFF'}}>{n.book_name}</Title>
                        <Text style={{color: '#BFBFBF'}}><b>Borrow Count</b>: {n.borrow_count}</Text> <br />

                        <Rate disabled value={n.rating} allowHalf  style={{
                            marginTop: '9px'
                        }}/>

                        
                    </>
                );
            default: 
                return <Text>{n.message}</Text>;
        }
    }

    return (
        <div style={{
            background: '#242424',
            minHeight: '120vh'
        }}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                margin: '8px 12px'
            }}>
                <Avatar shape='square' size={42} style={{
                    background: '#dc2626', textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
                    borderRadius: '10px', padding: '10px',
                }}
                >
                    <TbBooks style={{
                        color: '#ffffff', cursor: 'pointer',
                        marginTop: '5px'
                    }} size={22} />
                </Avatar>
                <Title level={4} style={{ color: '#fff' }}>Notifications</Title>

                <Tag style={{
                    color: '#ffffff', background: '#dc2626', borderRadius: '12px'
                }}>{notifications.length} new</Tag>
            </div>
            <Divider style={{borderColor: '#3f3f46'}}></Divider>
            <div>
                {category.map((cat) => (
                    <Tag
                        key={cat}
                        onClick={() => {
                            setSelectCategory(cat)
                        }}
                        style={{
                            cursor: 'pointer',
                            fontSize: '14px', borderRadius: '6px', padding: '4px 12px',
                            fontWeight: '500px', margin: '20px 10px',
                            background: selectCategory === cat ? '#dc2626' : '#3f3f46',
                        }}><Text
                        style={{
                            color: selectCategory === cat ? '#ffffff' : '#d1d5db',
                            background: selectCategory === cat ? '#dc2626' : '#3f3f46',
                            display: 'flex', alignItems: 'center', gap:'5px'
                        }}
                        >{cat !== "All" && categoryIcons[cat]} {cat}</Text>
                    </Tag>
                ))}
            </div>

            <div>
                {notifications.filter(notification =>
                    selectCategory === 'All'? true : notification.category === selectCategory
                ).map((n, index)=>(
                    <Card style={{
                        background: '#2C2C2C',
                        margin:'24px 24px',
                        borderColor: '#BFBFBF'
                    }}>
                        <div>
                            <Title level={4} style={{color: '#fff'}}>
                            <span style={{
                                fontSize: '14pt',
                            }}>{n.category !== "All" && categoryIcons[n.category]}</span> {n.title}
                            </Title>
                            {renderNotification(n)}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notification;