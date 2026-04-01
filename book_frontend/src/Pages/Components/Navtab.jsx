import { Avatar, Dropdown, Layout,Typography, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { CgMenuGridO  } from 'react-icons/cg';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";
import {Link} from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";



const {Header, Content} = Layout;
const {Text, Title} = Typography;
const Navtab = ({onMenuClick}) => {

    const [user, setUser] = useState(null);
    const user_id = localStorage.getItem("b_user_id");

    const fetchUser = async () => {
        try {
            
            const res = await axios.get(`http://localhost:5000/profile/${user_id}`);
            setUser(res.data.user);
            console.log(res.data.user);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchUser();
    },[])

    const profileMenu = (
        <div>
            {user&&(
                <Card
                title={<Title level={5}>{user.username}</Title>}
                actions={[
                    <div style={{display: 'flex', alignContent: 'center'}}>
                        <Link to={'/profile/edit'}><Text><FaRegEdit style={{
                            color: 'blue'
                        }}/> Edit</Text></Link>
                        <Link to={'/logout'}><Text><IoMdLogOut style={{
                            fontSize: '12pt', color: 'red'
                        }} />Logout</Text></Link>
                    </div>
                ]}
                >
                <Text type='secondary'>{user.email}</Text>
            </Card>
            )}
        </div>
    )
    return (
        <div>
            <Layout>
                <Header>
                    <div style={{display: 'flex', flexDirection:'row', alignItems:'center',
                        justifyContent:'space-between'
                    }}>
                        <div style={{display: 'flex'}}><CgMenuGridO color='white' onClick={onMenuClick}
                        fontSize={'25pt'} /></div>
                        <div>
                            <Dropdown 
                            popupRender={()=> profileMenu}
                            trigger={['click']}
                            placement='bottomRight'
                            >
                                <Avatar icon={<FaUserCircle />} 
                                    size={50}/>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
            </Layout>
        </div>
    );
};

export default Navtab;