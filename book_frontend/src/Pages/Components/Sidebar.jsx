import { Button, Divider, Drawer, Menu, Switch, Typography } from 'antd';
import axios from 'axios';
import React, { lazy, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import { FaBookOpen } from "react-icons/fa";

import '../../assets/CommonImages.css';

const {Text} = Typography;

const Sidebar = ({ open, onClose }) => {

    const role_id = localStorage.getItem("b_role_id")

    const [menus, setMenus] = useState([]);
    const [theme, setTheme] = useState("dark");

    const isDark = theme === 'dark';

    

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
        ? menus.map((menu, index) => ({
            label: menu.name,
            key: menu.path || index,
            onClick: () => navigate(menu.path),
        }))
        : [];
    return (
        <div>
            <Drawer
                title={<div style={{display: 'flex', justifyContent: 'space-between',
                    alignContent: 'center'
                }}>
                    <Link to={'/dashboard'}><Text style={{
                        fontWeight: 650, color: isDark ? "#ffffff" : "#000000",
                        fontSize: '15pt'
                    }} >Dashboard</Text></Link>
                    <Button type='text' onClick={onClose}
                    className={`toggle-btn ${open? "open": ""}`}
                    style={{
                        color: isDark? "#ffffff": "#000000",
                        fontSize: '20px'
                    }}
                    >{open&& <AiOutlineClose />}</Button>
                </div>}
                placement='left'
                open={open}
                onClose={onClose}
                closable={false}
                size={300}
                styles={{body: {
                    background: isDark? '#020617': '#ffffff',
                    color: isDark ? "#ffffff" : "#000000"
                },
                header: {
                background: isDark ? "#020617" : "#ffffff"
                }
             }}
                
            >
                <Divider style={{ borderColor: isDark? 'white': 'black', padding: '0px', marginTop: '0px' }} />
                <Menu
                    items={items}
                    mode='vertical'
                    theme={isDark? 'dark': 'light'}
                    style={{
                        background: isDark ? "#020617" : "#ffffff",
                        color: isDark ? "#ffffff" : "#000000",
                        borderRight: "none"
                    }}
                />
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: '25px'
                }}>
                    <Text style={{color: isDark? 'white': 'black'}}>Theme</Text>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <Text>{isDark? <Text style={{color: 'white'}}>Dark</Text>:
                        <Text style={{color: 'black'}}>Light</Text>
                        }</Text>
                        <Switch checked={isDark}
                        onChange={(checked)=>{setTheme(checked? "dark": "light")}}/>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default Sidebar;