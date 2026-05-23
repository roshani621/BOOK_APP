import React from 'react';
import { Layout, Typography } from 'antd'
import { CgMenuGridO } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { useNavigate } from 'react-router-dom';


const { Header } = Layout;
const {Title} = Typography;
const Navtab = ({ onMenuClick }) => {

    const navigate = useNavigate();
    return (
        <div>
            <Layout>
            <Header 
            style={{
                    background: '#001529',
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
                        <CgMenuGridO style={{ color: 'white', cursor:'pointer' }} size={28} onClick={onMenuClick} />
                        <Title level={4} style={{
                            color: 'white', marginTop: '10px'
                        }}>Library Dashboard</Title>
                    </div>
                    <div 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <GoBell style={{color: 'white', cursor: 'pointer'}} size={30}
                        onClick={()=>{navigate('/notification')}}
                        />
                        <FaUserCircle style={{ color: 'white', cursor:'pointer' }} size={30} 
                        onClick={()=>{navigate('/profile')}} />
                    </div>
                
            </Header>
            </Layout>
        </div>
    );
};

export default Navtab;