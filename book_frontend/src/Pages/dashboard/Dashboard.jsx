import { Layout } from 'antd';
import React, { useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import '../../assets/Main.css';  
import DashChart from '../../Components/DashChart';

const {Content} = Layout;

const Dashboard = () => {

    const [open, setOpen] = useState(false);

    const showDrawer = () =>setOpen(true);
    const closeDrawer = () =>setOpen(false);
    return (
        <div className='dashboard'>
            <Layout>
                <Navtab onMenuClick={showDrawer}/>
                <Sidebar open={open} onClose={closeDrawer}/>
                <Content>
                    <DashChart />
                </Content>
            </Layout>
        </div>
    );
};

export default Dashboard;