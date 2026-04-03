import { Layout } from 'antd';
import React, { useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';


const Dashboard = () => {

    const [open, setOpen] = useState(false);

    const showDrawer = () =>setOpen(true);
    const closeDrawer = () =>setOpen(false);
    return (
        <div>
            <Layout>
                <Navtab onMenuClick={showDrawer}/>
                <Sidebar open={open} onClose={closeDrawer}/>
            </Layout>
        </div>
    );
};

export default Dashboard;