import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Card, Tag,Table, Dropdown, Button } from 'antd';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { getAPI, postAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';
import { MdMenuBook } from 'react-icons/md';
import '../../assets/Common.css';
import { IoBookOutline } from 'react-icons/io5';
import { FiEye } from 'react-icons/fi';
import { GoCheckCircleFill } from 'react-icons/go';
import { FaRegClock, FaCalendarDays } from 'react-icons/fa6';
import { CgSandClock } from 'react-icons/cg';

const { Text, Title } = Typography;
const MyBorrowBook = () => {

    const [borrows, setBorrows] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [open, setOpen] = useState(false);
    const [returnBook, setReturnBook] = useState([]);

    const [count, setCount] = useState({
        total_books: 0,
        available_books: 0,
        total_borrow: 0,
        pending_requests: 0,
        approved_requests: 0,
        rejected_requests: 0,
        total_requests: 0,
        borrow_count: 0,
        overdue_count: 0,
        returned_count: 0
    });


    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);


    const borrowBooks = async () => {
        try {
            const res = await getAPI(API.BORROW_RECORDS);
            setBorrows(res.data.request);
        } catch (err) {
            console.log(err);
        }
    }
    const booksCount = async () => {
        try {
            const res = await getAPI(API.BOOKS_COUNT);
            setCount(res.data);
            console.log(res.data)
        } catch (err) {
            console.log(err);
        }
    }

    const returnedBook = async(book_id, request_id) =>{
        try{
            const res = await postAPI(API.BOOK_RETURN, {
                "book_id": book_id,
                "request_id": request_id
            });
            setReturnBook(res.data.return_book);
        } catch(err){
            console.log(err);
        }
    }

    const items = [
        {
            title: <Title level={5} style={{ color: '#F5F5F5' }}>Book</Title>,
            key: 'book',
            render: (_, book) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Avatar shape='square' style={{
                        width: '60px',
                        height: '80px',
                        objectFit: 'contain',
                    }} src={book.image}></Avatar>
                    <div>
                        <Title level={5} style={{
                            color: '#F8FAFC',
                            margin: '0px', fontWeight: '600'
                        }}>{book.book_name}</Title>
                        <Text style={{
                            color: '#94A3B8',
                            fontSize: '13px'
                        }}>{book.author}</Text>
                    </div>
                </div>
            )
        },
        {
            title: <Title level={5} style={{ color: '#F5F5F5' }}>Borrow Date</Title>,
            key: 'book',
            render: (_, book) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarDays
                            size={16}
                            color="#8B5CF6"
                        />
                        <Text style={{ color: '#E2E8F0', fontWeight: '500' }}>
                            {new Date(book.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: 'long',
                                year: 'numeric'
                            })}</Text>
                    </div>
                    <div>
                        <Text style={{
                            color: book.borrow_days < 0
                                ? '#4ADE80' : '#F87171', fontSize: '13px', fontWeight: '500',
                            marginLeft: '25px'
                        }}>{book.borrow_days} borrow days</Text>
                    </div>
                </div>
            )
        },
        {
            title: <Title level={5} style={{ color: '#F5F5F5' }}>Overdue Date</Title>,
            key: 'book',
            render: (_, book) => (
                <div style={{ gap: '16px' }}>
                    {book.overdue_days === 0 ? (
                        <div>
                            <Text style={{ color: '#E2E8F0', fontWeight: '500' }}>
                                {new Date(book.due_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: 'long',
                                    year: 'numeric'
                                })}</Text>
                            <Text
                                style={{
                                    color: book.borrow_days < 0
                                        ? '#4ADE80' : '#F87171', fontSize: '13px', fontWeight: '500'
                                }}
                            >
                                {book.overdue_days} days left
                            </Text>
                        </div>
                    )
                        :
                        (<div>
                            <Text style={{ color: '#E2E8F0', fontWeight: '500' }}>
                                {new Date(book.due_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: 'long',
                                    year: 'numeric'
                                })}</Text>

                        </div>)}
                </div>
            )
        },
        {
            title: <Title level={5} style={{ color: '#F5F5F5' }}>Status</Title>,
            key: 'book',
            render: (_, book) => (
                <div>
                    <Tag
                        style={{
                            background:
                                book.status === 'Pending' ? '#78350F' :
                                    book.status === 'Approved' ? '#14532D' :
                                        book.status === 'Rejected' ? '#7F1D1D' :
                                            '#374151',

                            color:
                                book.status === 'Pending' ? '#FDE68A' :
                                    book.status === 'Approved' ? '#BBF7D0' :
                                        book.status === 'Rejected' ? '#FECACA' :
                                            '#F9FAFB',
                            borderRadius: '12px'
                        }}
                    >
                        {book.status}
                    </Tag>
                </div>
            )
        },
        {
            title: <Title level={5} style={{ color: '#F5F5F5' }}>Action</Title>,
            key: 'book',
            render: (_, book) => (
                <div>
                    {book.status === 'Returned'? (
                    <div>...</div>
                    ): <div>
                        <Button
                        onClick={()=>{returnedBook(book.book_id, book.request_id)}}
                        style={{
                            borderRadius: '999px',
                            background: '#3B82F6',
                            borderColor: '#3B82F6',
                            color: '#F5F5F5'
                        }}>Return Book</Button>    
                    </div>}
                </div>
            )
        },

    ]

    const statusItems = [
        {
            key: "All",
            label: 'All'
        },
        {
            key: "Pending",
            label: "Pending"
        },
        {
            key: "Approved",
            label: "Approved"
        },
        {
            key: "Rejected",
            label: "Rejected"
        },
        {
            key: "Overdue",
            label: "Overdue"
        },
        {
            key: "Returned",
            label: "Returned"
        }
    ]

    const handleStatusChange = ({ key }) => {
        setSelectedStatus(key);
    }

    const stats = [
        { key: 'borrow_count', label: 'Total Borrowed', desc: 'Total books borrowed', icon: <MdMenuBook />, color: '#3B82F6' },
        { key: 'pending_requests', label: 'Pending', desc: 'Pending books requests', icon: <GoCheckCircleFill />, color: '#22C55E' },
        { key: 'approved_requests', label: 'Approved', desc: 'Approved books requests', icon: <FaRegClock />, color: '#EF4444' },
        { key: 'reject_requests', label: 'Rejected', desc: 'Rejected books requests', icon: <CgSandClock />, color: '#F59E0B' },
    ];
    console.log(count)
    const filterStatus = selectedStatus === "All" ? borrows : borrows.filter(b => b.status === selectedStatus);
    console.log(filterStatus);

    useEffect(() => {
        borrowBooks();
        booksCount();
    }, []);
    return (
        <div className='layout-bg'>
            <div>
                <Navtab onMenuClick={showDrawer} />
                <Sidebar open={open} onClose={closeDrawer} />
                <div>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ padding: '20px', margin: '10px' }}>
                            <Title level={2} style={{
                                color: '#F8FAFC', fontWeight: '700', marginBottom: '6px'
                            }}>My Borrowed Books</Title>
                            <Text style={{ color: '#94A3B8', fontSize: '15px' }}>
                                Track all your books you have borrowed from the library.
                            </Text>
                        </div>

                        <div style={{ padding: '20px', margin: '10px' }}>
                            <Dropdown
                                menu={{
                                    items: statusItems,
                                    selectedKeys: [selectedStatus],
                                    onClick: handleStatusChange,
                                }}
                                trigger={['click']}

                            >
                                <Button
                                    style={{
                                        background: '#111827',
                                        border: '1px solid #334155',
                                        color: '#F8FAFC',
                                        height: '42px',
                                        padding: '0px 18px',
                                        borderRadius: '9px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <IoBookOutline />
                                    {selectedStatus}
                                </Button>
                            </Dropdown>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '20px',
                            margin: '25px 30px',
                            padding: '20px',
                        }}
                    >
                        {stats.map((stat) => (
                            <Card key={stat.key} className="request-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <Avatar
                                        shape="circle"
                                        size={44}
                                        style={{ background: stat.color, flexShrink: 0 }}
                                        icon={React.cloneElement(stat.icon, { style: { fontSize: '20px', color: '#fff' } })}
                                    />
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '15px' }}>{stat.label}</Text>
                                        <Title level={3} style={{ margin: '2px 0' }}>{count[stat.key] ?? 0}</Title>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{stat.desc}</Text>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>


                </div>

                <div>
                    <Card style={{
                        background: '#2C2C2C', borderColor: '#535353',
                        padding: '0px', margin: '27px', borderRadius: '12px'
                    }}>
                        <Title level={5} style={{
                            marginBottom: '20px',
                            color: '#F5F5F5'
                        }}>Currently Borrowed</Title>
                        <Table
                            columns={items}
                            dataSource={filterStatus}
                            className='t-my-book'
                            pagination={false}
                        />
                    </Card>
                </div>


            </div>
        </div >
    );
};

export default MyBorrowBook;