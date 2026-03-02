import { Divider, Drawer, Menu, Typography } from 'antd';
import axios from 'axios';
import React, { lazy, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const {Text} = Typography;

const Sidebar = ({ open, onClose }) => {

    const role_id = localStorage.getItem("b_role_id")

    const [menus, setMenus] = useState([]);

    const navigate = useNavigate()
    const menuList = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:5000/menu", { role_id });
            console.log(res.data.menu.menus);
            console.log(role_id)
            setMenus(res.data.menu.menus || []);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (role_id) menuList();
    }, [role_id]);


    const items = Array.isArray(menus)
        ? menus.map(menu => ({
            label: menu.name,
            key: menu.path,
            onClick: () => navigate(menu.path),
        }))
        : [];
    return (
        <div>
            <Drawer
                title={<Link to={'/dashboard'}><Text>Dashboard</Text></Link>}
                placement='left'
                open={open}
                onClose={onClose}
                closable
            >
                <Divider style={{ borderColor: 'black', padding: '0px', margin: '0px' }} />
                <Menu
                    items={items}
                    mode='vertical'
                />
            </Drawer>
        </div>
    );
};

export default Sidebar;