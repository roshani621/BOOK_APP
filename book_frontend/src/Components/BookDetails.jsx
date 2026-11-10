import axios from 'axios';
import React, { useEffect } from 'react';
import { getAPI } from '../APIS/api';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Breadcrumb, Button, Card, Divider, Rate, Tabs, Tag, Typography } from 'antd';
import { FaBarcode, FaHeart, FaShareNodes, FaTag, FaUser } from 'react-icons/fa6';
import { SiBookstack } from "react-icons/si";
import { IoDocumentTextOutline } from "react-icons/io5";
import Navtab from './Navtab';
import Sidebar from './Sidebar';
import { FiBookOpen } from 'react-icons/fi';
import { FaCalendar, FaPenNib } from 'react-icons/fa';
import { LuBuilding2 } from 'react-icons/lu';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../assets/Common.css';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const BookDetails = () => {

    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            const res = await getAPI(`/book/${id}`);
            console.log(res.data);
            setBook(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!book) {
        return <div>Book not found</div>;
    }

    const items = [
        {
            key: '1',
            label: <Title level={5} style={{ color: '#d1d5db' }}>Description</Title>,
            children: <Text style={{ color: '#d1d5db' }}>{book.description}</Text>
        },
        {
            key: '2',
            label: <Title level={5} style={{ color: '#d1d5db' }}>Book Details</Title>,
            children: <div>
                <div className="book-detail-item">
                    <FaTag className="book-icon" />

                    <div>
                        <Text className="book-text">
                            Book ID
                        </Text>

                        <div className="book-secondary-text">
                            {book.id}
                        </div>
                    </div>
                </div>
                <div className="book-detail-item">
                    <FaBarcode className="book-icon" />

                    <div>
                        <Text className="book-text">
                            ISBN Number
                        </Text>

                        <div className="book-secondary-text">
                            {book.isbn}
                        </div>
                    </div>
                </div>
                <div className="book-detail-item">
                    <FaPenNib className="book-icon" />

                    <div>
                        <Text className="book-text">
                            Author
                        </Text>

                        <div className="book-secondary-text">
                            {book.author}
                        </div>
                    </div>
                </div>
                <div className="book-detail-item">
                    <LuBuilding2 className="book-icon" />

                    <div>
                        <Text className="book-text">
                            Publish By
                        </Text>

                        <div className="book-secondary-text">
                            {book.published_by}
                        </div>
                    </div>
                </div>
                <div className="book-detail-item">
                    <FaCalendar className="book-icon" />

                    <div>
                        <Text className="book-text">
                            Publish Date
                        </Text>

                        <div className="book-secondary-text">
                            {book.publish_date}
                        </div>
                    </div>
                </div>
            </div>
        },
        {
            key: '3',
            label: <Title level={5} style={{ color: '#d1d5db' }}>Reviews</Title>,
            children:
                <>
                    <div>
                        <Title level={5} style={{ color: '#d1d5db' }}>Reviews</Title>
                        <Text style={{
                            color: '#c4c4c4'
                        }}>{book.reviews.length} reviews</Text>
                    </div>
                    <div>
                        {book.reviews.map((r) => (
                            <div>
                                <Card
                                    style={{
                                        background: '#22272e', borderColor: '#3a3a40',
                                        margin: '14px 16px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start',
                                        gap: 16
                                     }}>
                                        <Avatar size={46}
                                        style={{border:'2.0px solid #D3D3D3'}}
                                        ><Text style={{ color: '#d1d5db', fontWeight: '600',
                                            fontSize: '15px'
                                         }}>
                                            {r.reviewer.split("")[0]}
                                            </Text>
                                        </Avatar>
                                        <div style={{flex: 1}}>
                                            <div style={{
                                                display: 'flex', flexDirection: 'column',
                                                alignItems: 'flex-start', gap: 6
                                            }}>
                                                <Text className='book-text'
                                                    style={{ color: '#d1d5db' }}
                                                >{r.reviewer}</Text>
                                                <Rate defaultValue={r.rating} disabled />
                                                <Text style={{ color: '#c4c4c4' }}>{r.comment}</Text>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <Text style={{ color: '#c4c4c4' }}>{dayjs(r.created_at).fromNow()}</Text>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </>
        }
    ]
    return (
        <div>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ background: '#171717' }}>
                <div>
                    <Card style={{
                        background: 'rgba(30,30,30,0.55)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}>
                        <div style={{ padding: '10px, 20px', marginBottom: '26px' }}>
                            <Breadcrumb
                                separator={
                                    <span style={{ color: '#6b7280' }}>
                                        /
                                    </span>
                                }
                                items={[
                                    {
                                        title: (
                                            <Link to={'/dashboard'}>
                                                <span style={{ color: '#9ca3af' }}>Library</span>
                                            </Link>
                                        )
                                    },
                                    {
                                        title: (
                                            <span style={{ color: '#9ca3af' }}>{book.book_name}</span>
                                        )
                                    }
                                ]}
                            />
                        </div>

                        <div style={{
                            display: 'flex', flexDirection: 'row',
                            gap: '20px', padding: '12px 16px', margin: '14px 18px',
                        }}>
                            <div>
                                <img src={book.image} alt={book.book_name}
                                    style={{
                                        width: '100%', height: '220px', objectFit: 'contain',
                                    }}
                                />
                            </div>
                            <div>
                                <Title level={3} style={{ fontWeight: '600', color: '#d1d5db' }}>{book.book_name}</Title>
                                <Title level={5} style={{ fontWeight: '600', color: '#d1d5db' }}>by {book.author}</Title>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Tag style={{
                                        background: '#dc2626',
                                        borderRadius: '12px', color: '#FFFFFF',
                                        fontWeight: '500', textAlign: 'center',
                                        fontSize: '12px'
                                    }}>{book.category}</Tag><Divider vertical style={{ borderColor: '#d1d5db' }} />

                                    <Text style={{ color: '#d1d5db', marginRight: '15px' }}>{book.rating}</Text>
                                    <Rate defaultValue={book.rating} disabled allowHalf />
                                </div>
                                <br />
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, minmax(230px, 1fr))',
                                    gap: '25px',
                                    marginTop: '30px'
                                }}>
                                    <Button style={{
                                        background: '#E63946', color: '#ffffff',
                                        borderColor: '#3a3a3a', height: '38px'
                                    }}>
                                        Borrow Book
                                    </Button>
                                    <Button style={{
                                        background: '#2a2a2a', color: '#f5f5f5',
                                        borderColor: '#3a3a3a', height: '38px'
                                    }}>
                                        <FaHeart
                                            style={{ color: 'red', marginLeft: '4px' }} />
                                        <span>Whishlist</span>
                                    </Button>
                                    <Button style={{
                                        background: '#2a2a2a', color: '#d1d5db',
                                        borderColor: '#3a3a3a', height: '38px'
                                    }}>
                                        <FaShareNodes style={{
                                            marginLeft: '4px', color: '#d1d5db'
                                        }} />
                                        Share
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <Divider />
                        <div style={{
                            display: 'grid', gridTemplateColumns: '30% 30% 30%',
                            gap: '35px',
                            justifyContent: 'center'
                        }}>
                            <Card style={{
                                background: '#202020',
                                borderColor: '#3a3a3a', borderRadius: '10px'
                            }}
                                styles={{
                                    body: {
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignContent: 'center',
                                        gap: '25px'
                                    }
                                }}
                            >
                                <Avatar shape='circle' size={50}
                                    style={{ borderColor: '#3a3a3a' }}
                                >
                                    <FiBookOpen style={{
                                        color: '#9ca3af', paddingTop: '10px',
                                        textAlign: 'center'
                                    }} size={22} />
                                </Avatar>
                                <div>
                                    <Title level={4} style={{ color: '#d1d5db', }}>{book.available_copies}</Title>
                                    <Text style={{ color: '#d1d5db' }}>Available Copies</Text>
                                </div>
                            </Card>
                            <Card style={{ background: '#202020', borderColor: '#3a3a3a', borderRadius: '10px' }}
                                styles={{
                                    body: {
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignContent: 'center',
                                        gap: '25px'
                                    }
                                }}>
                                <Avatar style={{ borderColor: '#3a3a3a' }} size={50}>
                                    <SiBookstack style={{
                                        color: '#9ca3af', paddingTop: '10px',
                                        textAlign: 'center'
                                    }} size={22} />
                                </Avatar>
                                <div>
                                    <Title level={4} style={{ color: '#d1d5db' }}>{book.total_copies}</Title>
                                    <Text style={{ color: '#d1d5db' }}>Total Copies</Text>
                                </div>
                            </Card>
                            <Card style={{ background: '#202020', borderColor: '#3a3a3a', borderRadius: '10px' }}
                                styles={{
                                    body: {
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignContent: 'center',
                                        gap: '25px'
                                    }
                                }}>
                                <Avatar style={{ borderColor: '#3a3a3a',
                                    
                                 }} size={50}>
                                    <IoDocumentTextOutline style={{
                                        color: '#9ca3af', paddingTop: '10px',
                                        textAlign: 'center'
                                    }} size={22} />
                                </Avatar>
                                <div>
                                    <Title level={4} style={{ color: '#d1d5db' }}>{book.total_pages}</Title>
                                    <Text style={{ color: '#d1d5db' }}>Total Pages</Text>
                                </div>
                            </Card>
                        </div>

                        <div style={{ margin: '28px 28px' }}>
                            <Card style={{ background: '#222222', borderColor: '#363636' }}>
                                <Tabs items={items}
                                 />
                            </Card>
                        </div>
                        <Divider />
                        <div>
                            <div style={{ marginTop: '18px' }}>
                                
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default BookDetails;