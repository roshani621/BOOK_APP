import React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, Layout, Typography } from 'antd'
import { TbBooks } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { getAPI } from '../APIS/api';

const { Header } = Layout;
const {Title, Text} = Typography;
const Navtab = ({ onMenuClick }) => {

    const [name, setName] = useState({});

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase();
    }
    const user_id = localStorage.getItem('b_user_id');
    useEffect(() => {
            const fetchUserProfile = async () => {
                try {
                    const res = await getAPI(`/user-profile/${user_id}`);
                    setName(res.data.user)
                } catch (err) {
                    console.log(err);
                }
            }
            fetchUserProfile();
        }, []);

    const navigate = useNavigate();
    return (
        <div>
            <Layout>
            <Header 
            style={{
                    background: '#1C1917',
                    padding: '0 24px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <Avatar shape='square' size={42} style={{
                            background: '#dc2626',textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
                            borderRadius: '10px', padding: '10px', 
                        }} 
                        onClick={onMenuClick}
                        >
                            <TbBooks style={{ color: '#ffffff', cursor:'pointer',
                            marginTop: '5px'
                             }} size={22}  />
                        </Avatar>
                        <Title level={4} style={{
                            color: '#ffffff', marginTop: '10px'
                        }}>Library</Title>
                    </div>
                    <div 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>

                        <GoBell style={{color: '#ffffff', cursor: 'pointer'}} size={26}
                        onClick={()=>{navigate('/notification')}}
                        />
                        <Avatar onClick={()=>{navigate('/profile')}} style={{
                            background: '#fecaca',
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