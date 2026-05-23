import { Drawer, Layout, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Main.css';
import { IoAddCircleOutline } from "react-icons/io5";
import { TbBookDownload } from "react-icons/tb";
import { MdOutlineEditNote } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const { Sider } = Layout;
const { Title, Text } = Typography;
const Sidebar = ({ open, onClose }) => {

    const navigate = useNavigate();
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
        HiOutlineClipboardDocumentList: <HiOutlineClipboardDocumentList className='sidebar-icon' />
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
                        title={<Text onClick={() => { navigate('/dashboard') }}
                            style={{ fontWeight: '200px', fontSize: '14pt', cursor: 'pointer', color: '#b91c1c' }}
                        >Dashboard</Text>}
                        open={open}
                        onClose={onClose}
                        size={250}
                        style={{
                            background: '#fee2e2',
                        }}
                    >
                        <div>
                            {menus.map((menu, index) => (
                                <Text
                                    className='sidebar-text'
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