import React from 'react';
import {Layout} from 'antd'
import { CgMenuGridO } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";


const {Header} = Layout;
const Navtab = ({ onMenuClick }) => {
    return (
        <div>
            <Layout>
                <Header>
                    <div style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center !important',
                        height: '100%',
                        marginTop: '15px'
                    }}>           
                        <CgMenuGridO style={{color: 'white'}} size={28} onClick={onMenuClick}/>
                        <FaUserCircle style={{color: 'white'}} size={28}/>
                    </div>
                </Header>
            </Layout>
        </div>
    );
};

export default Navtab;