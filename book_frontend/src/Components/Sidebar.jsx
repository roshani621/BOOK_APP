import { Drawer, Layout, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Main.css';

const {Sider} = Layout;
const {Title, Text} = Typography;
const Sidebar = ({open, onClose}) => {

    const navigate = useNavigate();
    const user_id = localStorage.getItem("b_user_id");
    const [menus, setMenus] = useState([]);

    const fetchMenus = async() =>{
        try{
            const res = axios.get(`http://127.0.0.1:5000/menu/${user_id}`);
            console.log(res.data);
            setMenus((await res).data.menus);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchMenus();
    },[])

    return (
        <div>
            <Layout>
                <Sider>
                    <Drawer
                    placement='left'
                    title={<Text onClick={()=>{navigate('/dashboard')}}
                    style={{fontWeight: '200px', fontSize: '14pt', cursor: 'pointer'}}
                    >Dashboard</Text>}
                    open={open}
                    onClose={onClose}
                    size={300}
                    >
                        {menus.map((menu, index)=>(
                            <Text
                            key={index}
                            style={{display:'block', cursor: 'pointer',
                                fontWeight: '500px', fontFamily:'Poppins, sans-serif', fontSize: '11pt',
                                margin: '10px'
                            }}
                            onClick={()=>navigate(menu.path)} className='sidebar-text'
                            >
                                {menu.name}
                            </Text>
                        ))}
                    </Drawer>
                </Sider>
            </Layout>
        </div>
    );
};

export default Sidebar;