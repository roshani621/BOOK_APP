import { Avatar, Layout } from 'antd';
import React, { useState } from 'react';
import { CgMenuGridO  } from 'react-icons/cg';
import { FaUserCircle } from "react-icons/fa";


const {Header, Content} = Layout;
const Navtab = ({onMenuClick}) => {
    return (
        <div>
            <Layout>
                <Header>
                    <div style={{display: 'flex', flexDirection:'row', alignItems:'center',
                        justifyContent:'space-between'
                    }}>
                        <div style={{display: 'flex'}}><CgMenuGridO color='white' onClick={onMenuClick}
                        fontSize={'25pt'} /></div>
                        <div><Avatar icon={<FaUserCircle />} size={50}/></div>
                    </div>
                </Header>
            </Layout>
        </div>
    );
};

export default Navtab;