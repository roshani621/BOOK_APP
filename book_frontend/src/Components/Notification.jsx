import { useEffect, useState } from 'react';
import Navtab from './Navtab';
import Sidebar from './Sidebar';
import { Avatar, Typography, Tag, Card, Rate, Button, Divider } from 'antd';
import { MdCancel } from "react-icons/md";
import { getAPI } from '../APIS/api';
import API from '../APIS/endpoints';
import '../assets/Common.css';
import { FaCircleCheck } from "react-icons/fa6";
import { FaUser } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LuBookOpenCheck, LuUserRoundPlus } from 'react-icons/lu';

dayjs.extend(relativeTime);
const { Title, Text } = Typography;

const Notification = () => {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [selectCategory, setSelectCategory] = useState("All")
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const fetchNotifications = async () => {
        try {
            const res = await getAPI(API.NOTIFICATION);
            setNotifications(res.data.notification);
            console.log(res.data.notification);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const category = ["All", ...new Set(notifications.map(n => n.type))];
    console.log(category);

    const getInitials = (name) => {
        console.log(name)
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const notificationCategory = (n) => {
        switch (n.type) {
            case "BOOK_OVERDUE":
                return (
                    <Card className="notification-card">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '20px'
                            }}
                        >
                            {/* Left side */}
                            <div className="notification-content">
                                <Avatar
                                    size={50}
                                    style={{ background: '#202F3F' }}
                                >
                                    <FaUser color="#60A5FA" />
                                </Avatar>

                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            color: '#d1d5db',
                                            margin: 0
                                        }}
                                    >
                                        {n.title}
                                    </Title>

                                    <Text style={{ color: '#cbd5e1' }}>
                                        {n.message}
                                    </Text>
                                </div>
                            </div>

                            {/* Right side */}
                            <Text
                                style={{
                                    color: '#cbd5e1',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px'
                                }}
                            >
                                {dayjs(n.created_at).fromNow()}
                            </Text>
                        </div>
                    </Card>
                )
            case "BORROW_REQUEST":
                return (
                    <Card className="notification-card">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '15px'
                            }}
                        >
                            {/* Left side */}
                            <div
                                className="notification-content"
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center'
                                }}
                            >
                                <Avatar
                                    size={50}
                                    style={{ background: '#202F3F' }}
                                >
                                    <FaUser color="#60A5FA" style={{
                                        paddingTop: '10px'
                                    }}/>
                                </Avatar>

                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            color: '#d1d5db',
                                            margin: 0
                                        }}
                                    >
                                        {n.title}
                                    </Title>

                                    <Text style={{ color: '#cbd5e1' }}>
                                        {n.message}
                                    </Text>
                                </div>
                            </div>

                            {/* Right side - time */}
                            <Text
                                style={{
                                    color: '#94a3b8',
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {dayjs(n.created_at).fromNow()}
                            </Text>
                        </div>
                    </Card>
                )
            case "RETURNED_BOOK":
                return (
                    <Card className="notification-card">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '15px'
                            }}
                        >
                            {/* Left side */}
                            <div
                                className="notification-content"
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center'
                                }}
                            >
                                <Avatar
                                    size={50}
                                    style={{ background: '#203329' }}
                                >
                                    <FaCircleCheck color="#4ADE80" style={{
                                        paddingTop: '7px'
                                    }} />
                                </Avatar>

                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            color: '#d1d5db',
                                            margin: 0
                                        }}
                                    >
                                        {n.title}
                                    </Title>

                                    <Text style={{ color: '#cbd5e1' }}>
                                        {n.message}
                                    </Text>
                                </div>
                            </div>

                            {/* Right side - time */}
                            <Text
                                style={{
                                    color: '#94a3b8',
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {dayjs(n.created_at).fromNow()}
                            </Text>
                        </div>
                    </Card>
                )
            case "APPROVED_REQUEST":
                return (
                    <Card className="notification-card">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '20px'
                            }}
                        >
                            {/* Left side */}
                            <div className="notification-content">
                                <Avatar
                                    size={50}
                                    style={{ background: '#203329'}}
                                >
                                    <LuBookOpenCheck color="#4ADE80" style={{
                                        paddingTop: '10px'
                                    }}/>
                                </Avatar>

                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            color: '#d1d5db',
                                            margin: 0
                                        }}
                                    >
                                        {n.title}
                                    </Title>

                                    <Text style={{ color: '#cbd5e1' }}>
                                        {n.message}
                                    </Text>
                                </div>
                            </div>

                            {/* Right side - time */}
                            <Text
                                style={{
                                    color: '#cbd5e1',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px'
                                }}
                            >
                                {dayjs(n.created_at).fromNow()}
                            </Text>
                        </div>
                    </Card>
                )
            case "NEW_ARRIVAL":
                return (
                    <Card className='notification-card'>
                        {n.recipient_role_id === "R2" ? (
                            <Card className="notification-card">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '20px'
                                    }}
                                >
                                    {/* Left side */}
                                    <div className="notification-content">
                                        <Avatar
                                            size={50}
                                            style={{ background: '#203329' }}
                                        >
                                            <LuBookOpenCheck color="#4ADE80" />
                                        </Avatar>

                                        <div>
                                            <Title
                                                level={5}
                                                style={{
                                                    color: '#d1d5db',
                                                    margin: 0
                                                }}
                                            >
                                                {n.title}
                                            </Title>

                                            <Text style={{ color: '#cbd5e1' }}>
                                                {n.message}
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Right side - time */}
                                    <Text
                                        style={{
                                            color: '#cbd5e1',
                                            whiteSpace: 'nowrap',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {dayjs(n.created_at).fromNow()}
                                    </Text>
                                </div>
                            </Card>
                        ) : <></>}
                    </Card>
                )
            case "REJECTED_REQUEST":
                return (
                    <Card className="notification-card">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '20px'
                            }}
                        >
                            <div className="notification-content">
                                <Avatar
                                    size={50}
                                    style={{
                                        background: '#3B2525'
                                    }}
                                >
                                    <MdCancel
                                        color="#F87171"
                                        size={24}
                                        style={{paddingTop: '8px'}}
                                    />
                                </Avatar>

                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            color: '#d1d5db',
                                            margin: 0
                                        }}
                                    >
                                        {n.title}
                                    </Title>

                                    <Text style={{ color: '#cbd5e1' }}>
                                        {n.message}
                                    </Text>
                                </div>
                            </div>

                            <Text
                                style={{
                                    color: '#cbd5e1',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px'
                                }}
                            >
                                {dayjs(n.created_at).fromNow()}
                            </Text>
                        </div>
                    </Card>
                )
            case "USER_REGISTERED":
                return (
                    <Card className="notification-card">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '20px'
                            }}
                        >
                            <div className="notification-content">
                                <Avatar
                                    size={50}
                                    style={{
                                        background: '#3B2525'
                                    }}
                                >
                                    <LuUserRoundPlus
                                        color="#F87171"
                                        size={24}
                                        style={{paddingTop: '8px'}}
                                    />
                                </Avatar>

                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            color: '#d1d5db',
                                            margin: 0
                                        }}
                                    >
                                        {n.title}
                                    </Title>

                                    <Text style={{ color: '#cbd5e1' }}>
                                        {n.message}
                                    </Text>
                                </div>
                            </div>

                            <Text
                                style={{
                                    color: '#cbd5e1',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px'
                                }}
                            >
                                {dayjs(n.created_at).fromNow()}
                            </Text>
                        </div>
                    </Card>
                )
        }
    }

    return (
        <div className='layout-bg'>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />

            <div style={{
                margin: '8px 16px', padding: '5px 10px'
            }}>
                <Title level={4} style={{ color: '#f1f5f9' }}>Notifications</Title>
                <Text style={{ color: '#cbd5e1' }}>Stay updated with your latest activity and alerts.</Text>
            </div>
            <div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px',
                    margin: '14px 16px'
                }}>
                    {category.map((cat) => {
                        const count =
                            cat === 'All'
                                ? notifications.length
                                : notifications.filter((item) => item.type === cat).length
                        return (
                            <Tag style={{
                                padding: '5px 12px',
                                borderRadius: '5px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: selectCategory === cat ? '#ffffff' : '#d1d5db',
                                background: selectCategory === cat ? 'linear-gradient(135deg, #5B21B6, #7C3AED)' : '#3f3f46',
                                borderColor: selectCategory === cat ? '#713fe0' : '#555555',
                                display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer'
                            }}
                                key={cat}
                                onClick={() => setSelectCategory(cat)}
                            >
                                {cat.replace(/_/g, ' ')} {count}
                            </Tag>
                        )
                    })}
                </div>

                <div>
                    {notifications.filter((n) => {
                        if (selectCategory === "All") {
                            return true
                        }

                        return n.type === selectCategory
                    }).map((n) => (
                        <div key={n._id}>
                            {notificationCategory(n)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default Notification;