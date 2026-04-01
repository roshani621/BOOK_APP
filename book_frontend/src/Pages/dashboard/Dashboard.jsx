import React, { useState } from 'react';
import Navtab from '../Components/Navtab';
import Sidebar from '../Components/Sidebar';
import { Layout } from 'antd';
import Dash_Content from '../Components/Dash_Content';

const {Content} = Layout;
const Dashboard = () => {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () =>{
        setDrawerOpen(true);
    }

    const closeDrawer = () =>{
        setDrawerOpen(false);
    }
    return (
            <Layout style={{minHeight: '100vh',}}>
                <Navtab onMenuClick={openDrawer}/>
                <Sidebar open={drawerOpen} onClose={closeDrawer}/>
                <Content>
                    <Dash_Content />
                </Content>
            </Layout>
    );
};

export default Dashboard;