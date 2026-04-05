import { Button, Form, Input, InputNumber } from 'antd';
import React, { useState } from 'react';
import Navtab from '../../Components/Navtab';
import Sidebar from '../../Components/Sidebar';

const UpdateBook = () => {

    const [open, setOpen] = useState(false);
    
    const showDrawer = () =>setOpen(true);
    const closeDrawer = () =>setOpen(false);
    return (
        <div>
            <div>
                <Navtab onMenuClick={showDrawer}/>
                <Sidebar open={open} onClose={closeDrawer}/>
                <Form 
                style={{
                    width:'450px',
                    height: '500px',
                    border: '1px solid black',
                    borderRadius: '20px',
                    padding: '40px',
                    position: 'absolute',
                    top: '15%',
                    left: '33%',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                }}
                >
                    <Form.Item 
                    label={'Title'}
                    >
                        <Input placeholder='enter book name'/>
                    </Form.Item>
                    <Form.Item
                    label={'Author'}
                    >
                        <Input placeholder='enter book author'/>
                    </Form.Item>
                    <Form.Item
                    label={'Category'}
                    >
                        <Input placeholder='enter book category'/>
                    </Form.Item>
                    <Form.Item
                    label={'ISBN Number'}
                    >
                        <Input placeholder='enter isbn number' />
                    </Form.Item>
                    <Form.Item
                    label={'Total Copies'}
                    >
                        <InputNumber min={1} /> 
                    </Form.Item>
                    <Form.Item
                    label={'Avaialble Copies'}
                    >
                        <InputNumber min={1} /> 
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>Add Book</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UpdateBook;