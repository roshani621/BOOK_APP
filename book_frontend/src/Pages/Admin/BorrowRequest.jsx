import {
    Card, Typography, Input, Button, Modal, Row, Col, Avatar, Tag,
    Tooltip,
    Select,
    DatePicker,
    Table,
    Popconfirm
} from 'antd';
import React, { useState, useEffect } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { MdCancel, MdMenuBook } from "react-icons/md";
import '../../assets/Common.css';
import { IoSearchOutline } from 'react-icons/io5';
import { getAPI, postAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';
import { FaCalendarAlt, FaCheckCircle, FaRegCalendarAlt } from 'react-icons/fa';
import { FaBookOpenReader, FaClipboardList } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker
const { TextArea } = Input;
const BorrowRequest = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [remark, setRemark] = useState('');
    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [dateRange, setDateRange] = useState(null);

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

    const filterRequest = books.filter((request) => {
        const search = searchText.trim().toLowerCase();

        const matchSearch =
            !search ||
            String(request.book_name || '').toLowerCase().includes(search) ||
            String(request.username || '').toLowerCase().includes(search) ||
            String(request.email || '').toLowerCase().includes(search) ||
            String(request.request_id || '').toLowerCase().includes(search) ||
            String(request.book_id || '').toLowerCase().includes(search);

        const matchStatus =
            statusFilter === 'All' ||
            request.status === statusFilter;

        let matchDate = true;

        if (dateRange && dateRange[0] && dateRange[1]) {
            const selectedDate = request.created_at;

            if (!selectedDate) {
                matchDate = false;
            } else {
                const recordDate = dayjs(selectedDate);

                matchDate =
                    recordDate.isSameOrAfter(dateRange[0], 'day') &&
                    recordDate.isSameOrBefore(dateRange[1], 'day');
            }
        }

        return matchSearch && matchStatus && matchDate;
    });

    const [selectedId, setSelectedId] = useState({
        request_id: null,
        book_id: null
    });

    const fetchRequest = async () => {
        try {
            const res = await getAPI(API.BORROW_REQUEST);
            console.log(res.data.request);
            setBooks(res.data.request);
        } catch (err) {
            console.log(err);
        }
    }

    const handleRejectClick = (request_id, book_id) => {
        setSelectedId({ request_id, book_id });
        setIsModalOpen(true)
    }

    const user_id = localStorage.getItem("b_user_id");

    const handleApproved = async (requestStatus, request_id, book_id) => {
        try {
            console.log(requestStatus, request_id, book_id);
            const res = await postAPI(API.REQUEST, {
                request_status: requestStatus,
                request_id: request_id,
                user_id: user_id,
                book_id: book_id,
            });
            console.log(requestStatus, request_id, user_id, book_id);
            console.log(res.data);
            fetchRequest();
        } catch (err) {
            console.log(err);
        }
    }

    const handleReject = async (requestStatus, request_id, book_id) => {
        try {
            if (!remark.trim()) {
                alert("please enter remrk for reject request");
                return;
            }
            const user_id = localStorage.getItem("b_user_id");
            const res = await postAPI(
                API.REQUEST,
                {
                    request_status: requestStatus,
                    request_id: request_id,
                    user_id: user_id,
                    book_id: book_id,
                    remark: remark
                });
            console.log(res.data);
            setIsModalOpen(false);
            setRemark('');
            fetchRequest();
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

    const items = [
        {
            title: <Text className='th-text'>Request ID</Text>,
            key: 'request_id',
            render: (_, book) => (
                <div>
                    <Text className='t-text'>{book.request_id}</Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Book</Text >,
            key: 'book',
            render: (_, book) => (
                <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar shape='square' style={{
                        width: '50px', height: '50px', objectFit: 'contain'
                    }} src={book.image}></Avatar>
                    <div>
                        <Text className='book-name'>{book.book_name}</Text><br />
                        <Text className='book-author' type='secondary'>{book.author}</Text>
                    </div>
                </div>
            )
        }, {
            title: <Text className='th-text'>User</Text >,
            key: 'user',
            render: (_, book) => (
                <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar size={35} style={{ padding: '5px' }}><Text className='user-name'>
                        {getInitials(book.username)}</Text></Avatar>
                    <div>
                        <Text className='user-name'>{book.username}</Text><br />
                        <Text className='user-id' type='secondary'>{book.user_id}</Text>
                    </div>
                </div>
            )
        }, {
            title: <Text className='th-text'>Borrow Date</Text >,
            key: 'request_date',
            render: (_, book) => (
                <div>
                    <Text>
                        {book.request_date ? <Text className='table-date'>{new Date(book.request_date).toLocaleDateString()}</Text> :
                            <Text className='table-date'> - </Text>}
                    </Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Due Date</Text >,
            key: 'due_date',
            render: (_, book) => (
                <div>
                    <Text>
                        {book.due_date ? <Text className='table-date'>{new Date(book.due_date).toLocaleDateString()}</Text> :
                            <Text className='table-date'> - </Text>}
                    </Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Return Date</Text >,
            key: 'return_date',
            render: (_, book) => (
                <div>
                    <Text>
                        {book.return_date ? <Text className='table-date'>{new Date(book.return_datejgv).toLocaleDateString()}</Text> :
                            <Text className='table-date'> - </Text>}
                    </Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Status</Text >,
            key: 'status',
            render: (_, book) => (
                <Tag
                    style={{
                        background:
                            book.status === 'Pending' ? '#FDE68A' :
                                book.status === 'Approved' ? '#BBF7D0' :
                                    book.status === 'Rejected' ? '#FECACA' :
                                        '#374151',

                        color:
                            book.status === 'Pending' ? '#78350F' :
                                book.status === 'Approved' ? '#14532D' :
                                    book.status === 'Rejected' ? '#7F1D1D' :
                                        '#F9FAFB',
                        borderRadius: '9px'
                    }}
                >
                    {book.status}
                </Tag>
            )
        },
        {
            title: <Text className='th-text'>Actions</Text >,
            key: 'actions',
            render: (_, book) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Tooltip title="View request">
                            <FiEye color='#9ca3af' style={{
                                cursor: 'pointer', fontSize: '26px'
                            }} onClick={() => { console.log("Preview", book) }} />
                        </Tooltip>
                        <Tooltip title="Approve Request">
                            {book.status === 'Pending' && (
                                <FaCheckCircle color='#22C55E' style={{
                                    cursor: 'pointer',
                                    fontSize: '26px'
                                }}
                                    onClick={() => { handleApproved("Approved", book.request_id, book.book_id) }}
                                />
                            )}
                        </Tooltip>
                        <Tooltip title="Reject Request">
                            {book.status === 'Pending' && (
                                <MdCancel color='#EF4444' style={{
                                    cursor: 'pointer',
                                    fontSize: '29px'
                                }}
                                    onClick={() => { handleRejectClick(book.request_id, book.book_id) }}
                                />
                            )}
                        </Tooltip>
                    </div>
                </div>
            )
        }
    ]

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    useEffect(() => {
        fetchRequest();
        booksCount();
    }, [])
    return (
        <div className='layout-bg'>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ marginTop: '20px', background: '#232323' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    margin: '10px 16px', padding: '12px 16px'
                }}>
                    <Avatar shape='square' size={55}><FaClipboardList color='purple'
                        size={30} /></Avatar>
                    <div>
                        <Title level={3} style={{
                            color: '#F5F5F5',
                            fontWeight: '600', margin: '0px',
                        }}>Borrow Requests</Title>
                        <Text style={{
                            color: '#94A3B8',
                            fontSize: '14px'
                        }}>View and manage book borrow requests from users. Approve or reject requests
                            based on availability and library rules.
                        </Text>
                    </div>
                </div>

                <div style={{
                    display: 'flex', gap: '55px', justifyContent: 'center',
                    alignItems: 'center', marginTop: '30px'
                }}>
                    <Row gutter={[20, 20]} style={{ margin: '30px 30px ' }}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{
                                background: '#2C2C2C', borderColor: '#3F3F46',
                                borderRadius: '14px', width: '280px', minHeight: '130px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }}
                                styles={{
                                    body: {
                                        padding: '24px'
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <Avatar shape='square' size={75} style={{ background: '#28145C' }}>
                                        <MdMenuBook size={35} color='#8B5CF6' />
                                    </Avatar>
                                    <div>
                                        <Title level={2} style={{
                                            color: '#F8FAFC', fontWeight: '600', margin: '0px',
                                            fontSize: '28px'
                                        }}>{count.total_borrow}</Title>
                                        <Text style={{
                                            color: '#CBD5E1',
                                            fontSize: '13px'
                                        }}>Total Borrowed</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{
                                background: '#2C2C2C', borderColor: '#3F3F46',
                                borderRadius: '14px', width: '280px', minHeight: '130px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }}
                                styles={{
                                    body: {
                                        padding: '24px'
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <Avatar shape='square' size={75} style={{ background: '#073C4A' }}>
                                        <FaBookOpenReader size={35} color='#06B6D4' />
                                    </Avatar>
                                    <div>
                                        <Title level={2} style={{
                                            color: '#F8FAFC', fontWeight: '600', margin: '0px',
                                            fontSize: '28px'
                                        }}>{count.borrow_count}</Title>
                                        <Text style={{
                                            color: '#d1d5db',
                                            fontSize: '13px'
                                        }}>Currently Borrowed</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{
                                background: '#2C2C2C', borderColor: '#3F3F46',
                                borderRadius: '14px', width: '280px', minHeight: '130px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }}
                                styles={{
                                    body: {
                                        padding: '24px'
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <Avatar shape='square' size={75} style={{ background: '#49350A' }}>
                                        <FaCalendarAlt size={35} color='#EF4444' />
                                    </Avatar>
                                    <div>
                                        <Title level={2} style={{
                                            color: count.borrow_count < 0 ?
                                                '#f87171' :
                                                '#fbbf24',
                                            fontWeight: '600', margin: '0px',
                                            fontSize: '28px'
                                        }}>{count.overdue_count}</Title>
                                        <Text style={{
                                            color: '#d1d5db',
                                            fontSize: '13px'
                                        }}>Overdue Books</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={{
                                background: '#2C2C2C', borderColor: '#3F3F46',
                                borderRadius: '14px', width: '280px', minHeight: '130px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }}
                                styles={{
                                    body: {
                                        padding: '24px'
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <Avatar shape='square' size={75} style={{ background: '#073B28' }}>
                                        <FaRegCalendarAlt size={35} color='#22C55E' />
                                    </Avatar>
                                    <div>
                                        <Title level={2} style={{
                                            color: '#F8FAFC', fontWeight: '600', margin: '0px',
                                            fontSize: '28px'
                                        }}>{count.returned_count}</Title>
                                        <Text style={{
                                            color: '#CBD5E1',
                                            fontSize: '13px'
                                        }}>Returened Books</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div>
                    <Card style={{
                        background: '#2C2C2C', borderColor: '#292929',
                        margin: '20px 25px', padding: '8px 10px', border: '1px solid #3A3A3A',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <Title level={4} style={{
                                    color: '#F5F5F5',
                                    padding: '0px 18px', fontWeight: '600'
                                }}>Borrow Requests</Title>
                            </div>
                            <div>
                                <div style={{ margin: '10px 15px' }}>
                                    <Row gutter={[16, 16]} className='request-filter'>
                                        <Col>
                                            <Text className='th-text'>Search</Text ><br />
                                            <Input
                                                className="request-search"
                                                allowClear
                                                value={searchText}
                                                onChange={(e) => { setSearchText(e.target.value) }}
                                                placeholder='search here books, users ...'
                                                prefix={
                                                    <IoSearchOutline
                                                        style={{
                                                            color: '#94A3B8',
                                                            fontSize: '18px',
                                                        }}
                                                    />
                                                }
                                            />
                                        </Col>
                                        <Col>
                                            <Text className='th-text'>Status</Text >
                                            <Select
                                                value={statusFilter}
                                                onChange={(value) => { setStatusFilter(value) }}
                                                className="request-status-select"
                                                options={[
                                                    {
                                                        value: 'All',
                                                        label: 'All'
                                                    },
                                                    {
                                                        value: 'Pending',
                                                        label: 'Pending'
                                                    },
                                                    {
                                                        value: 'Approved',
                                                        label: 'Approved'
                                                    },
                                                    {
                                                        value: 'Rejected',
                                                        label: 'Rejected'
                                                    },
                                                    {
                                                        value: 'Overdue',
                                                        label: 'Overdue'
                                                    },
                                                ]}
                                            />
                                        </Col>
                                        <Col>
                                            <Text className='th-text'>Date Range</Text > <br />
                                            <RangePicker
                                                value={dateRange}
                                                onChange={(dates) => { setDateRange(dates) }}
                                                format={'DD-MM-YYYY'}
                                                allowClear
                                                className="request-date-picker"
                                            />
                                        </Col>

                                        <Col className="reset-button-col">
                                            <Button
                                                className="request-reset-btn"
                                                onClick={() => {
                                                    setSearchText('');
                                                    setStatusFilter('All');
                                                    setDateRange(null);
                                                }}
                                                disabled={!searchText && statusFilter === 'All' && !dateRange}

                                            >
                                                Reset
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>

                        <Table
                            columns={items}
                            dataSource={filterRequest}
                            className='request-table'
                            rowKey="request_id"
                            style={{ marginTop: '20px', }}

                            pagination={{
                                pageSize: 5,
                                showSizeChanger: true,
                                pageSizeOptions: ['5', '10', '20'],
                                showTotal: (total, range) =>
                                    `Showing ${range[0]}-${range[1]} of ${total} requests`
                            }}
                        />
                    </Card>
                </div>

                <Modal
                    title={
                        <Title level={5} style={{ color: '#D1D5DB' }}>Reject Request</Title>
                    }
                    open={isModalOpen}
                    
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => {
                                setIsModalOpen(false);
                                setRemark('');
                            }}
                            style={{
                                background: '#2C2C2C',
                                border: '1px solid #555555',
                                color: '#D1D5DB',
                                borderRadius: '6px'
                            }}
                        >
                            Cancel
                        </Button>,

                        <Button
                            key="reject"
                            type="primary"
                            danger
                            disabled={!remark.trim()}
                            onClick={() =>
                                handleReject(
                                    "Rejected",
                                    selectedId.request_id,
                                    selectedId.book_id
                                )
                            }
                            style={{
                                background: '#DC2626',
                                border: '1px solid #DC2626',
                                color: '#FFFFFF',
                                borderRadius: '6px'
                            }}
                        >
                            Reject
                        </Button>
                    ]}
                    styles={{
                        mask: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)'
                        },
                        container: {
                            background: '#232323',
                            padding: '12px 16px',
                            border: '1px solid #3A3A3A',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                        },
                        content: {
                            background: '#232323',
                            border: '1px solid #3A3A3A',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                        },
                        header: {
                            background: '#232323',
                            borderBottom: '1px solid #3A3A3A',
                            paddingBottom: '16px'
                        },
                        body: {
                            background: '#232323',
                            paddingTop: '20px'
                        },
                        footer: {
                            background: '#232323',
                            borderTop: '1px solid #3A3A3A',
                            paddingTop: '16px'
                        }
                    }}
                    wrapClassName='reject-modal'
                >
                    <Text style={{ color: '#D1D5DB' }}>Please enter rejection remark:</Text>
                    <TextArea
                        rows={3}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder='Enter remark...'
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#1B1B1B',
                            borderColor: '#3A3A3A',
                            color: '#F3F4F6',
                        }}
                    />
                </Modal>
            </div >
        </div >
    );
};

export default BorrowRequest;