import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Card, Tag, Table, Dropdown, Button, Row, Col, Input, Select, DatePicker } from 'antd';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { getAPI, postAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';
import { MdCancel, MdMenuBook } from 'react-icons/md';
import '../../assets/Common.css';
import { IoSearchOutline } from 'react-icons/io5';
import { GoCheckCircleFill } from 'react-icons/go';
import { CgSandClock } from 'react-icons/cg';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const MyBorrowBook = () => {

    const [borrows, setBorrows] = useState([]);
    const [open, setOpen] = useState(false);
    const [returnBook, setReturnBook] = useState([]);

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

    const filterRequest = borrows.filter((request) => {
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
    })
    console.log(statusFilter);


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

    const returnedBook = async (book_id, request_id) => {
        try {
            const res = await postAPI(API.BOOK_RETURN, {
                "book_id": book_id,
                "request_id": request_id
            });
            setReturnBook(res.data.return_book);
        } catch (err) {
            console.log(err);
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    const columns = [
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
        },
        {
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
        },
        {
            title: <Text className='th-text'>Borrow Date</Text >,
            key: 'request_date',
            render: (_, book) => (
                <div>
                    <Text className='table-date'>
                        {book.request_date ?
                            dayjs(book.request_date).format('MMM DD, YYYY') : '-'
                        }
                    </Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Due Date</Text >,
            key: 'due_date',
            render: (_, book) => (
                <div>
                    <Text className='table-date'>
                        {book.due_date ?
                            dayjs(book.due_date).format('MMM DD, YYYY') : '-'
                        }
                    </Text>
                </div>
            )
        },
        {
            title: <Text className='th-text'>Return Date</Text >,
            key: 'return_date',
            render: (_, book) => (
                <div>
                    <Text className='table-date'>
                        {book.return_date ?
                            dayjs(book.return_date).format('MMM DD, YYYY') : '-'
                        }
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
                            book.status === 'Pending' ? '#332A18' :
                                book.status === 'Approved' ? '#182A20' :
                                    book.status === 'Rejected' ? '#351C20' :
                                        book.status === 'Overdue' ? '#352219' :
                                            book.status === 'Return' ? '#162436' :
                                                '#374151',
                        color:
                            book.status === 'Pending' ? '#F6C453' :
                                book.status === 'Approved' ? '#4CAF70' :
                                    book.status === 'Rejected' ? '#F87171' :
                                        book.status === 'Overdue' ? '#FB923C' :
                                            book.status === 'Returned' ? '#669DF6' :
                                                '#669DF6',
                        borderRadius: '9px'
                    }}
                >
                    {book.status}
                </Tag>
            )
        },
        {
            title: <Title className='th-text'>Action</Title>,
            key: 'book',
            render: (_, book) => (
                <div>
                    {book.status === 'Returned' ? (
                        <div>...</div>
                    ) : <div>
                        <Button
                            onClick={() => { returnedBook(book.book_id, book.request_id) }}
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


    const stats = [
        { key: 'borrow_count', label: 'Total Borrowed', desc: 'Total books borrowed', icon: <MdMenuBook />, color: '#3B82F6' },
        { key: 'approved_requests', label: 'Approved', desc: 'Approved books requests', icon: <GoCheckCircleFill />, color: '#22C55E' },
        { key: 'rejected_requests', label: 'Rejected', desc: 'Rejected books requests', icon: <MdCancel />, color: '#EF4444' },
        { key: 'pending_requests', label: 'Pending', desc: 'Pending books requests', icon: <CgSandClock />, color: '#F59E0B' },
    ];
    console.log(count)


    useEffect(() => {
        borrowBooks();
        booksCount();
    }, []);
    return (
        <div style={{ background: '#2C2C2C', overflow: 'auto' }}>
            <div>
                <Navtab onMenuClick={showDrawer} />
                <Sidebar open={open} onClose={closeDrawer} />
                <div style={{ marginTop: '20px', }}>
                    <div style={{ padding: '20px', margin: '10px' }}>
                        <Title level={2} style={{
                            color: '#F8FAFC', fontWeight: '700', marginBottom: '6px'
                        }}>My Borrowed Books</Title>
                        <Text style={{ color: '#94A3B8', fontSize: '15px' }}>
                            Track all your books you have borrowed from the library.
                        </Text>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
                            gap: '20px',
                            margin: '20px', padding: '20px'
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
                    <div style={{
                        margin: '20px 40px', padding: '10px 15px',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <Title level={4} style={{
                                color: '#F5F5F5',
                                padding: '0px 18px', fontWeight: '600'
                            }}>My Borrow Books</Title>
                        </div>
                        <Row gutter={[20, 20]} className='request-filter'>
                            <Col>
                                <Title level={5} style={{
                                    color: '#F9FAFB',
                                    fontWeight: '500px'
                                }}>Search</Title>
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
                                <Title level={5} style={{
                                    color: '#F9FAFB',
                                    fontWeight: '500px'
                                }}>Status</Title>
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
                                        {
                                            value: 'Returned',
                                            label: 'Returned'
                                        },
                                    ]}
                                />
                            </Col>
                            <Col>
                                <Title level={5} style={{
                                    color: '#F9FAFB',
                                    fontWeight: '500px'
                                }}>Date Range</Title>
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
        </div >
    );
};

export default MyBorrowBook;