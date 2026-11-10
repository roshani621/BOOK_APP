import React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, Layout, Typography, Input, Card, Dropdown } from 'antd'
import { TbBooks } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { getAPI } from '../APIS/api';

import '../assets/Main.css';
import API from '../APIS/endpoints';

const { Header } = Layout;
const { Title, Text } = Typography;
const Navtab = ({ onMenuClick }) => {

    const [name, setName] = useState({});
    const [search, setSearch] = useState("");
    const [count, setCount] = useState("");
    const [searchResult, setSearchResult] = useState({
        books: [],
        users: [],
    })

    const globalSearch = async (searchValue) => {
        try {

            if (!search.trim()) {
                setSearchResult({
                    books: [],
                    users: [],
                    borrow_requests: []
                });
                return;
            }

            const res = await getAPI(
                `/global-search?search=${encodeURIComponent(searchValue)}`
            );
            console.log("Search data:", res.data);
            if (res.data.status) {
                setSearchResult({
                    books: res.data.books,
                    users: res.data.users,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchUserProfile = async () => {
        try {
            const res = await getAPI(`/user-profile/${user_id}`);
            setName(res.data.user)
        } catch (err) {
            console.log(err);
        }
    }

    const notificationCount = async () => {
        try {
            const res = await getAPI(API.NOTIFICATION);
            setCount(res.data.notification);
        } catch (err) {
            console.log(err)
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }
    const user_id = localStorage.getItem('b_user_id');
    useEffect(() => {
        fetchUserProfile();
        notificationCount();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            globalSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const navigate = useNavigate();

    const searchDropdown = (
        <div className='search-dropdown'>
            {searchResult.books.map((book) => (
                <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} className='search-result'>
                    <div>
                        <Title style={{ color: '#d1d5db' }} level={5}>{book.book_name}</Title>
                    </div>
                    <div>
                        <Text style={{ color: '#d1d5db' }}>{book.id}</Text>
                    </div>
                </div>
            ))}
        </div>
    )


    return (
        <div>
            <Layout>
                <Header
                    className='main-header'>
                    <div className='header-left'>
                        <Avatar shape='square' size={42} style={{
                            background: '#dc2626', textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
                            borderRadius: '10px', padding: '10px',
                        }}
                            onClick={onMenuClick}
                        >
                            <TbBooks style={{
                                color: '#ffffff', cursor: 'pointer',
                                marginTop: '5px'
                            }} size={22} />
                        </Avatar>
                        <Title level={4} style={{
                            color: '#ffffff', marginTop: '10px'
                        }}>Library</Title>
                    </div>
                    <div className='header-right'>
        
                            <Dropdown popupRender={() => searchDropdown} trigger={['click']}>
                                <Input placeholder='books, users, borrow requests.....'
                                    className='global-search'
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value) }}
                                    allowClear
                                    prefix={<IoSearchOutline />}
                                />
                            </Dropdown>

                            <div className='notification-wrapper'>
                                <GoBell style={{ color: '#ffffff', cursor: 'pointer'}} size={35}
                                    onClick={() => { navigate('/notification') }} 
                                />
                                {count.length > 0 && (
                                    <span className="notification-count">
                                        {count.length}
                                    </span>
                                )}
                            </div>
                            <Avatar onClick={() => { navigate('/profile') }} style={{
                                background: '#fecaca', padding: '15px',
                                cursor: 'pointer'
                            }}>
                                <Text style={{
                                    color: '#dc2626'
                                }}>
                                    {getInitials(name.username)}
                                </Text>
                            </Avatar>
                        </div>

                </Header>
            </Layout>
        </div>
    );
};

export default Navtab;