import { Card, Col, Menu, Row, Table, Tag, Typography } from 'antd';
import axios from 'axios';
import { FaFilter } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import '../../assets/Common.css';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';
import { getAPI } from '../../APIS/api';
import API from '../../APIS/endpoints';

const {Text, Title} = Typography;
const BorrowHistory = () => {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [open, setOpen] = useState(false);
    
    const showDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const fetchRequest = async() =>{
        try{
            const res = await getAPI(API.BORROW_RECORDS);
            const newData = res.data.request;

            const userId = localStorage.getItem('b_user_id');
            const userRecords = res.data.request.filter(
                item=>item.user_id === userId
            );

            setData(userRecords);
            setFilteredData(userRecords);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchRequest()
    },[]);

    

    const columns = [
        {
            title: <Text className='th-text'>Book</Text >,
            key: 'book',
            align: 'center',
            render: (_, record)=>(
                <div style={{color: 'white'}}>
                    <Text className='t-text'>{record.book_name}</Text><br />
                    <Text className='t-text' type='secondary'>{record.author}</Text>
                </div>
            )
        },{
            title: <Text className='th-text'>User</Text >,
            key: 'user',
            align: 'center',
            render: (_, record)=>(
                <div style={{color: 'white'}}>
                    <Text className='t-text'>{record.username}</Text><br />
                    <Text className='t-text' type='secondary'>{record.email}</Text>
                </div>
            )
        },{
            title: <Text className='th-text'>Request Date</Text >,
            key: 'date',
            align: 'center',
            render: (_, record)=>(
                <div>
                    <Text className='t-text'>{new Date(record.request_date).toLocaleDateString()}</Text>
                </div>
            )
        },{
            title: <Text className='th-text'>Borrow Days</Text >,
            dataIndex: 'borrow_days',
            key: 'days',
            align: 'center'           
        },{
            title: <Text className='th-text'>Status</Text >,
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status)=>{
                let color = '#d97706';

                if(status === 'Approved') color = '#16a34a';
                else if(status === 'Rejected') color = '#b91c1c';

                return <Tag color={color} style={{fontSize: '12px',
                    borderRadius: '14px', background: '#d4d4d8'
                }}>{status}</Tag>
            }
        },
        {
            title: <Text className='th-text'>Created At</Text >,
            key: 'created_at',
            align: 'center',
            render: (_, record)=>(
                <Text className='t-text'>{new Date(record.created_at).toLocaleString()}</Text>
            )
        },
        {
            title: <Text className='th-text'>Action Date</Text >,
            key: 'action_date',
            align: 'center',
            render: (_, record) => {
                if (record.status === 'Approved') {
                    return (
                        <Text style={{ color: 'green' }}>
                            {record.approved_date 
                                ? new Date(record.approved_date).toLocaleString()
                                : '-'}
                        </Text>
                    );
                }

                if (record.status === 'Rejected') {
                    return (
                        <Text style={{ color: 'red' }}>
                            {record.approved_date 
                                ? <Text className='t-text'>{record.remark}</Text>
                                : '-'}
                        </Text>
                    );
                }

                return <Text className='t-text' type="secondary">Pending</Text>;
            }
        },
        {
            title: <Text className='th-text'>Due Date</Text >,
            key: 'due_date',
            align: 'center',
            render: (_, record)=>(
                <Text className='t-text'>{new Date(record.due_date).toLocaleString()}</Text>
            )
        }
    ]
    return (
        <div style={{background: '#2C2C2C', minHeight: '100vh'}}>
            <Navtab onMenuClick={showDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
            <div>
                <div>
                    {["All", "Pending", "Approved", "Rejected"].map((status, index) => (
                    <Tag
                        key={status}
                        style={{
                            cursor: 'pointer',
                            color: selectedStatus === status ? '#ffffff' : '#d1d5db',
                            background: selectedStatus === status ? '#dc2626' : '#3f3f46',
                            fontSize: '13px', borderRadius: '999px', padding: '4px 12px',
                            fontWeight: '500px', margin: '20px 10px'
                        }}
                        onClick={() => {
                            setSelectedStatus(status);

                            if(status === "All"){
                                setFilteredData(data);
                            } else {
                                setFilteredData(
                                    data.filter(book=>book.status === status)
                                )
                            }
                        }}
                    >{status}</Tag>))}                                    
                </div>
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
                            rowClassName={()=>'custom-row'}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BorrowHistory;