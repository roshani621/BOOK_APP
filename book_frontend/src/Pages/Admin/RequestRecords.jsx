import { Avatar, Card, Col, Input, Select, DatePicker, Button, Row, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import '../../assets/Common.css';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { getAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';
import '../../assets/Common.css';
import { IoSearchOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { MdMenuBook } from 'react-icons/md';
import { CgSandClock } from "react-icons/cg";
import { FaClipboardCheck, FaRegClock } from 'react-icons/fa';
import { TbCancel } from "react-icons/tb";
import { GoCheckCircleFill } from 'react-icons/go';


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const RequestRecords = () => {

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [dateType, setDateType] = useState('request_date');
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

    const filterRequest = data.filter((request) => {
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
            const selectedDate = request[dateType];

            if (!selectedDate) {
                matchDate = false;
            }
            else {
                const recordDate = dayjs(selectedDate).startOf('day');

                matchDate =
                    recordDate.isSameOrAfter(dateRange[0], 'day') &&
                    recordDate.isSameOrBefore(dateRange[1], 'day');
            }
        }

        return matchSearch && matchStatus && matchDate;
    });

    const fetchRequest = async () => {
        try {
            const res = await getAPI(API.BORROW_RECORDS);
            setData(res.data.request)
        } catch (err) {
            console.log(err);
        }
    }

    const bookCount = async () => {
        try {
            const res = await getAPI(API.BOOKS_COUNT);
            setCount(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchRequest()
        bookCount();
    }, []);

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const columns = [
        {
            title: <Text className='th-text'>Request ID</Text>,
            key: 'request_id',
            render: (_, record) => (
                <div>
                    <Text className='t-text'>{record.request_id}</Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Book</Text >,
            key: 'book',
            render: (_, record) => (
                <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar shape='square' style={{
                        width: '50px', height: '50px', objectFit: 'contain'
                    }} src={record.image}></Avatar>
                    <div>
                        <Text className='book-name'>{record.book_name}</Text><br />
                        <Text className='book-author' type='secondary'>{record.author}</Text>
                    </div>
                </div>
            )
        }, {
            title: <Text className='th-text'>User</Text >,
            key: 'user',
            render: (_, record) => (
                <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar size={35} style={{ padding: '5px' }}><Text className='user-name'>
                        {getInitials(record.username)}</Text></Avatar>
                    <div>
                        <Text className='user-name'>{record.username}</Text><br />
                        <Text className='user-id' type='secondary'>{record.user_id}</Text>
                    </div>
                </div>
            )
        }, {
            title: <Text className='th-text'>Borrow Date</Text >,
            key: 'request_date',
            render: (_, record) => (
                <div>
                    <Text className='table-date'>{dayjs(record.request_date).format('MMM DD, YYYY')}</Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Due Date</Text >,
            key: 'due_date',
            render: (_, record) => (
                <div>
                    <Text className='table-date'>{dayjs(record.due_date).format('MMM DD, YYYY')}</Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Return Date</Text >,
            key: 'return_date',
            render: (_, record) => (
                <div>
                    <Text className='table-date'>{record.return_date ? 
                dayjs(record.return_date).format('MMM DD, YYYY') :'-'    
                }</Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Status</Text >,
            key: 'status',
            render: (_, record) => (
                <Tag
                    style={{
                        background:
                            record.status === 'Pending' ? '#FDE68A' :
                                record.status === 'Approved' ? '#BBF7D0' :
                                    record.status === 'Rejected' ? '#FECACA' :
                                        '#374151',

                        color:
                            record.status === 'Pending' ? '#78350F' :
                                record.status === 'Approved' ? '#14532D' :
                                    record.status === 'Rejected' ? '#7F1D1D' :
                                        '#F9FAFB',
                        borderRadius: '9px'
                    }}
                >
                    {record.status}
                </Tag>
            )
        },
        {
            title: <Text className='th-text'>Action</Text>,
            key: 'action',
            render: (_, record) => (
                <div>
                    ...
                </div>
            )
        }
    ]

    const stats = [
        { key: 'total_borrow', label: 'Total Borrowed', desc: 'Total books borrowed', icon: <MdMenuBook />, color: '#3B82F6' },
        { key: 'pending_requests', label: 'Pending', desc: 'Total pending requests', icon: <CgSandClock />, color: '#F59E0B' },
        { key: 'approved_requests', label: 'Approved', desc: 'Total approved requests', icon: <FaClipboardCheck />, color: '#22C55E' },
        { key: 'reject_requests', label: 'Rejected', desc: 'Total rejected requests', icon: <TbCancel />, color: '#EF4444' },
    ];
    return (
        <div style={{ background: '#2C2C2C', minHeight: '100vh' }}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                margin: '15px 20px'
            }}>
                <div>
                    <Avatar shape='circle' size={50} style={{
                        background: '#FF5A5F',
                        textAlign: 'center'
                    }}>
                        <MdMenuBook style={{
                            fontSize: '26px', color: '#ffffff',
                            paddingTop: '5px'
                        }} />
                    </Avatar>
                </div>
                <div>
                    <Title level={3} style={{ color: '#f9fafb' }}>
                        Borrow Records
                    </Title>
                    <Text style={{ color: '#f9fafb' }}>
                        View and manage all books borrow records.
                    </Text>
                </div>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '25px',
                    margin: '25px 30px',
                    padding: '25px',
                }}
            >
                {stats.map((stat) => (
                    <Card key={stat.key} className="request-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

            <div>
                <div style={{ margin: '20px 40px', padding: '10px 15px' }}>
                    <Row gutter={[20, 20]} className='request-filter'>
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
                        <Col>
                            <Text className='th-text'>Date Type</Text > <br />

                            <Select
                                value={dateType}
                                onChange={(value) => { setDateType(value) }}
                                className="request-date-type"
                                options={[
                                    {
                                        value: 'request_date',
                                        label: 'Request Date'
                                    },
                                    {
                                        value: 'approved_date',
                                        label: 'Approved Date'
                                    },
                                    {
                                        value: 'rejected_date',
                                        label: 'Rejected Date'
                                    },
                                    {
                                        value: 'due_date',
                                        label: 'Due Date'
                                    },
                                    {
                                        value: 'overdue_date',
                                        label: 'Overdue Date'
                                    },
                                    {
                                        value: 'return_date',
                                        label: 'Returned Date'
                                    },
                                ]}
                            />
                        </Col>
                        <Col className="reset-button-col">
                            <Button
                                className="request-reset-btn"
                                onClick={() => {
                                    setSearchText('');
                                    setStatusFilter('All');
                                    setDateType('request_date');
                                    setDateRange(null);
                                }}
                                disabled={!searchText && statusFilter === 'All' && !dateRange}

                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className='table-container'>
                    <Table
                        className='request-table'
                        columns={columns}
                        dataSource={filterRequest}
                        rowKey={'_id'}

                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20'],
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} requests`
                        }}
                    />
                </div>

            </div>
        </div>
    );
};

export default RequestRecords;