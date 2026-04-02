import React, { useState } from 'react';
import { Form, Input, Typography, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import axios from 'axios';
import { useForm } from 'antd/es/form/Form';

const Login = () => {

    const [form] = Form.useForm();

    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmit = async (e) => {
        try {
            const res = await axios.post('http://localhost:5000/login', data);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <div style={{
                width: '400px',
                height: '350px',
                border: '1px solid black',
                borderRadius: '20px',
                padding: '30px',
            }}>
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label={'Username'}
                        name={'email'}
                        required={true}
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" }
                        ]}
                    >
                        <Input type={'email'} value={data.email} onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Password'}
                        name='password'
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password type={'password'} value={data.password} onChange={handleChange}
                            iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>Login</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;