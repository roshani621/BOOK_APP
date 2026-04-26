import { Card, Col, Menu, Row, Table, Tag, Typography } from 'antd';
import axios from 'axios';
import { FaFilter } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import '../../assets/Common.css';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';

const {Text} = Typography;
const BorrowHistory = () => {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState({
        "All": '',
        "Approved": '',
        "Rejected": '',
        "Pending": ''
    });
    const [open, setOpen] = useState(false);
    
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const fetchRequest = async() =>{
        try{
            const res = await axios.get("http://127.0.0.1:5000/borrow-records");
            const newData = res.data.request;
            setData(newData);

            setFilteredData(res.data.request);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchRequest()
    },[]);

    const filterRecords = ["All","Pending", "Approved", "Rejected"];

    const menuClick = (e) =>{
        const status = e.key;
        setSelectedStatus(status);
        console.log(status)
        if(status === 'All'){
            setFilteredData(data);
        } else{
            setFilteredData(
                data.filter(book => book.status === status)
            )
        }
    }
    const items = [
        {
            key: 'filter1',
            label: 'Filter',
            icon: <FaFilter />,
            children: filterRecords.map((status)=>({
                key: status,
                label: status
            }))
        }
    ]

    const columns = [
        {
            title: 'Book',
            key: 'book',
            align: 'center',
            render: (_, record)=>(
                <div>
                    <Text>{record.title}</Text><br />
                    <Text type='secondary'>{record.author}</Text>
                </div>
            )
        },{
            title: 'User',
            key: 'user',
            align: 'center',
            render: (_, record)=>(
                <div>
                    <Text>{record.username}</Text><br />
                    <Text type='secondary'>{record.email}</Text>
                </div>
            )
        },{
            title: 'Date',
            key: 'date',
            align: 'center',
            render: (_, record)=>(
                <div>
                    <Text>{new Date(record.request_date).toLocaleDateString()}</Text>
                </div>
            )
        },{
            title: 'Days',
            dataIndex: 'borrow_days',
            key: 'days',
            align: 'center'           
        },{
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status)=>{
                let color = 'gold';

                if(status === 'Approved') color = 'green';
                else if(status === 'Rejected') color = 'red';

                return <Tag color={color} style={{fontSize: '16px'}}>{status}</Tag>
            }
        },{
            title: 'Approved Date / Rejected Date',
            key: 'approved_date',
            align:'center',
            render: (_, record)=>{
                const date =
                record.status === 'Approved'
                    ? record.approved_date
                    : record.status === 'Rejected'
                    ? record.updated_at
                    : record.request_date;
                return(
                    <Text>
                        {date ? new Date(date).toLocaleString() : 'N/A'}
                    </Text>
                )
            }
        },
        {
            title: 'Created Date',
            key: 'created_at',
            align: 'center',
            render: (_, record)=>(
                <Text>{new Date(record.created_at).toLocaleString()}</Text>
            )
        },
        {
            title: 'Due Date',
            key: 'due_date',
            align: 'center',
            render: (_, record)=>(
                <Text>{new Date(record.due_date).toLocaleString()}</Text>
            )
        }
    ]
    return (
        <div>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div>
                <Menu
                onClick={menuClick}
                defaultOpenKeys={['filter1']}
                selectedKeys={[selectedStatus]}
                items={items}
                placement={['bottomEnd']}
                mode='inline'
                style={{
                    width: '200px',
                    margin: '40px',
                }}
                />
            </div>
            <div>
                <Row>
                    <Col>
                        <div className='table-container'>
                            <Table 
                            columns={columns}
                            dataSource={filteredData}
                            rowKey={'_id'}
                            style={{
                                textAlign: 'center',
                            }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BorrowHistory;