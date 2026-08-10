import axios from 'axios';
import React, { useEffect } from 'react';
import { getAPI } from '../APIS/api';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Breadcrumb, Button, Card, Divider, Rate, Tag, Typography } from 'antd';
import { FaArrowLeft, FaHeart, FaShareNodes, FaUser } from 'react-icons/fa6';
import { SiBookstack } from "react-icons/si";
import { IoDocumentTextOutline } from "react-icons/io5";

import Navtab from './Navtab';
import Sidebar from './Sidebar';
import { FiBookOpen } from 'react-icons/fi';

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

    return (
        <div>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div style={{ background: '#232323' }}>
                <div>
                    <Card style={{
                        background: 'rgba(30,30,30,0.55)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}>
                        <div style={{padding: '10px, 20px', marginBottom: '26px'}}>
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
                            gap: '30px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <img src={book.image} alt={book.book_name}
                                    style={{
                                        width: '100%', height: '290px', objectFit: 'contain',
                                        borderRadius: '12px'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 2 }}>
                                <Title level={3} style={{ fontWeight: '600', color: '#d1d5db' }}>{book.book_name}</Title>
                                <Title level={5} style={{ fontWeight: '600', color: '#d1d5db' }}>by {book.author}</Title>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Tag style={{
                                        background: '#dc2626',
                                        borderRadius: '12px', color: '#d1d5db',
                                        fontWeight: '600'
                                    }}>{book.category}</Tag><Divider vertical style={{ borderColor: '#d1d5db' }} />

                                    <Text style={{ color: '#d1d5db', marginRight: '15px' }}>{book.rating}</Text>
                                    <Rate defaultValue={book.rating} disabled allowHalf />
                                </div>
                                <br />
                                <div>
                                    <Title style={{ color: '#d1d5db' }} level={5}>Description</Title>
                                    <div>
                                        <Text style={{ color: '#d1d5db' }}>{book.description}</Text>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Button style={{
                                    borderRadius: '10px', background: 'rgba(255, 255, 255, 0.11)',
                                    borderColor: '#F2F2F2'
                                }}>
                                    <Text style={{
                                        fontWeight: '600',
                                        color: '#d1d5db'
                                    }}>Add to Whishlist <FaHeart
                                            style={{ color: 'red', marginLeft: '4px' }} /></Text>
                                </Button>
                                <Button style={{
                                    borderRadius: '10px', borderColor: '#F2F2F2',
                                    background: 'rgba(255, 255, 255, 0.11)',
                                }}>
                                    <Text style={{ fontWeight: '600', color: '#d1d5db' }}>Share <FaShareNodes style={{
                                        marginLeft: '4px', color: '#d1d5db'
                                    }} /></Text>
                                </Button>
                            </div>
                        </div>
                        <Divider />
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '25px'
                        }}>
                            <Card style={{ background: '#232323', border: 'none', borderRadius: '10px' }}
                                styles={{
                                    body: {
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignContent: 'center',
                                        gap: '25px'
                                    }
                                }}
                            >
                                <FiBookOpen style={{ color: '#9ca3af' }} size={22} />
                                <div>
                                    <Title level={4} style={{ color: '#d1d5db', }}>{book.available_copies}</Title>
                                    <Text style={{ color: '#d1d5db' }}>Available Copies</Text>
                                </div>
                            </Card>
                            <Card style={{ background: '#232323', border: 'none', borderRadius: '10px' }}
                                styles={{
                                    body: {
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignContent: 'center',
                                        gap: '25px'
                                    }
                                }}>
                                <SiBookstack style={{ color: '#9ca3af' }} size={22} />
                                <div>
                                    <Title level={4} style={{ color: '#d1d5db' }}>{book.total_copies}</Title>
                                    <Text style={{ color: '#d1d5db' }}>Total Copies</Text>
                                </div>
                            </Card>
                            <Card style={{ background: '#232323', border: 'none', borderRadius: '10px' }}
                                styles={{
                                    body: {
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignContent: 'center',
                                        gap: '25px'
                                    }
                                }}>
                                <IoDocumentTextOutline style={{ color: '#9ca3af' }} size={22} />
                                <div>
                                    <Title level={4} style={{ color: '#d1d5db' }}>{book.total_pages}</Title>
                                    <Text style={{ color: '#d1d5db' }}>Total Pages</Text>
                                </div>
                            </Card>
                        </div>

                        <div style={{display: 'flex'}}>
                            <div style={{flex: 1}}>
                                <Card style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                                    background: '#232323', border: 'none'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                        }}>
                                        <Title style={{ color: '#d1d5db' }} level={5}>Author</Title>
                                        <Text style={{ color: '#d1d5db' }}>{book.author}</Text>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                        }}>
                                        <Title style={{ color: '#d1d5db' }} level={5}>Publish By</Title>
                                        <Text style={{ color: '#d1d5db' }}>{book.published_by}</Text>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                        }}>
                                        <Title style={{ color: '#d1d5db' }} level={5}>Publish Date</Title>
                                        <Text style={{ color: '#d1d5db' }}>{book.publish_date}</Text>
                                    </div>
                                </Card>
                            </div>
                            <div style={{ margin: '12px 18px', flex: 2 }}>
                            <Title level={5} style={{ color: '#d1d5db' }}>Reviews</Title>
                            {book.reviews.map((r) => (
                                <Card style={{
                                    background: '#232323', margin: '18px',
                                    borderColor: '#232323'
                                }}>
                                    <div style={{ display: 'flex', gap: '35px' }}>
                                        <Title level={5} style={{ color: '#d1d5db' }}>
                                            <Avatar><FaUser /></Avatar>  {r.reviewer}</Title>
                                    </div>
                                    <br />
                                    <Text style={{ color: '#d1d5db' }}>{r.comment}</Text>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }}>
                                        <Rate defaultValue={r.rating} disabled allowHalf />
                                    </div>
                                </Card>
                            ))}
                        </div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default BookDetails;