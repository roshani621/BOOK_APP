import React from 'react';
import { Layout } from 'antd'
import { CgMenuGridO } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";


const { Header } = Layout;
const Navtab = ({ onMenuClick }) => {
    return (
        <div>
            <Layout>
            <Header>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0px 20px'
                }}>
                    <CgMenuGridO style={{ color: 'white', cursor:'pointer' }} size={30} onClick={onMenuClick} />
                    <FaUserCircle style={{ color: 'white', cursor:'pointer' }} size={30} />
                </div>
            </Header>
            </Layout>
        </div>
    );
};

export default Navtab;