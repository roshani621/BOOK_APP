import { useEffect, useState } from 'react';
import { Card, notification, Typography, Tag } from 'antd';
import Navtab from './Navtab';
import Sidebar from './Sidebar';
import axios from 'axios';
import {
    MdPendingActions,
    MdCheckCircle,
    MdMenuBook,
    MdAccessTimeFilled,
    MdAssignmentReturn,
    MdWarning,
    MdPersonAdd,
    MdNotifications
} from 'react-icons/md'
import '../assets/Common.css';

const { Title, Text } = Typography;
const Notification = () => {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const fetchNotification = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/notification');
            console.log(res.data.notification);
            setNotifications(res.data.notification);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchNotification();
    }, []);

    const notificationIcon = (type) => {
        switch (type) {
            case "request_pending":
                return (
                    <MdPendingActions size={26} color='orange' />
                )
            case "request_approved":
                return (
                    <MdCheckCircle size={26} color='green' />
                )
            case "book_added":
                return (
                    <MdMenuBook size={26} color='#1677ff' />
                )
            case "due_reminder":
                return (
                    <MdAccessTimeFilled size={26} color='purple' />
                )
            case "return_submitted":
                return (
                    <MdAssignmentReturn size={26} color='#13c2c2' />
                )
            case "fine_alert":
                return (
                    <MdWarning size={26} color='red' />
                )
            case "member_joined":
                return (
                    <MdPersonAdd size={26} color='#52c41a' />
                )
            default:
                return (
                    <Notification size={26} color='grey' />
                )
        }
    }
    return (
        <div style={{ background: '#FAECE7' }}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div>
                <Title level={4} style={{
                    margin: '20px'
                }}>Notifications</Title>
                {notifications.map((notification) => (
                    <Card style={{ background: '#FAECE7',
                        margin: '20px 20px'
                     }} className='card'>
                        <div style={{
                            width: '5px',
                            minHeight: '100%',
                            background: '#D85A30',
                            border: '1px solid #D85A30',
                            position: 'absolute',
                            left: '0%',
                            top: '0%',
                            borderRadius: '18px'
                        }} />
                        <div>
                            <div className='card-inner'>
                                {notificationIcon(notification.type)}
                                <Title level={5}>{notification.title}</Title>
                                <div>
                                    <Tag style={{
                                        backgroundColor:'#993C1D',
                                        borderRadius: '12px'
                                    }}>{notification.status?
                                        <Text style={{color:'#FAECE7'}}>{notification.status}</Text>:
                                        <Text></Text>
                                    }</Tag>
                                </div>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridColumn:'auto'
                            }}>
                                <Text className='text'>{notification.message}</Text>
                                {notification.user_id && notification.book_id ? 
                                <div className='card-inner'>
                                    <Text className='text'>User - {notification.user_id}</Text>
                                    <Text className='text'>Book - {notification.book_id}</Text>
                                </div>:
                                <div>

                                </div>
                            }
                               {notification.type === 'fine_alert'?
                                <Text>Fine - {notification.fine_amount}</Text>:
                                <Text></Text>  
                            } 
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notification;