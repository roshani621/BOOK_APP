import { Drawer, Layout, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/Main.css';
import { IoAddCircleOutline } from "react-icons/io5";
import { TbBookDownload } from "react-icons/tb";
import { MdOutlineEditNote } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaBookOpen } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbBookUpload } from "react-icons/tb";

const { Sider } = Layout;
const { Title, Text } = Typography;
const Sidebar = ({ open, onClose }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const user_id = localStorage.getItem("b_user_id");
    const [menus, setMenus] = useState([]);

    const fetchMenus = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/menu/${user_id}`);
            console.log(res.data);
            setMenus(res.data.menus);
        } catch (err) {
            console.log(err);
        }
    }

    const iconMap = {
        IoAddCircleOutline: <IoAddCircleOutline className='sidebar-icon' />,
        TbBookDownload: <TbBookDownload className='sidebar-icon' />,
        MdOutlineEditNote: <MdOutlineEditNote className='sidebar-icon' />,
        HiOutlineClipboardDocumentList: <HiOutlineClipboardDocumentList className='sidebar-icon' />,

        FaBookOpen: <FaBookOpen className="sidebar-icon" />,
        FaClipboardList: <FaClipboardList className="sidebar-icon" />,
        FaHistory: <FaHistory className="sidebar-icon" />,
    };

    useEffect(() => {
        fetchMenus();
    }, [])

    return (
        <div>
            <Layout>
                <Sider>
                    <Drawer
                        placement='left'
                        title={
                        <div 
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        >
                            <LuLayoutDashboard size={26} color='#dc2626'/>
                            <Title level={4}
                            style={{
                                color:'#ffffff',
                                marginTop: '10px',
                                cursor: 'pointer'
                            }}
                            onClick={()=>{navigate('/dashboard')}}
                            >Dashboard</Title>
                        </div>
                        }
                        open={open}
                        onClose={onClose}
                        size={250}
                        style={{
                            background: '#1C1917'
                        }}
                    >
                        <div>
                            {menus.map((menu, index) => (
                                <Text
                                    className={`sidebar-text ${
                                        location.pathname === menu.path ? "active": ""
                                    }`}
                                    key={index}
                                    onClick={() => navigate(menu.path)} >
                                    {iconMap[menu.icon]} {menu.name}
                                </Text>
                            ))}
                        </div>

                    </Drawer>
                </Sider>
            </Layout>
        </div>
    );
};

export default Sidebar;