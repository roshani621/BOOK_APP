import React, { useState } from 'react';
import { Form, Input, Typography, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import {appNotification, showMessage} from '../../Components/NotificationMessage';
import { FaBookOpenReader } from "react-icons/fa6";

import '../../assets/Main.css';
import { postAPI } from '../../APIS/api';

const {Text, Title} = Typography;
const Login = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmit = async (values) => {
        try {
            const res = await postAPI('/login', values);
            console.log(res.data);
            console.log(res.data)
            localStorage.setItem("b_role_id", res.data.role_id);
            localStorage.setItem("b_user_id", res.data.user_id);
            localStorage.setItem("b_token", res.data.token);
            appNotification.login(res.data.username);
            navigate('/dashboard');
            
        } catch (err) {
            console.log(err.response?.data);
            appNotification.loginError();
        }
    }
    return (
        <div className='form-page'>
            <div style={{
                width: '400px',
                height: '380px',
                border: '1px solid white',
                borderRadius: '20px',
                padding: '40px',
                position: 'absolute',
                top: '12%',
                left: '60%'
            }} className='form'>
                <Form form={form} layout='vertical' onFinish={handleSubmit} >
                    <div>
                        <div style={{display: 'flex', justifyContent:'center',
                            alignItems:'center',
                        }}>
                            <Title className='login-title' level={4}>
                            <FaBookOpenReader  size={25} style={{marginRight: '15px', color: '#C92D30'}}/>
                            Open your library</Title>
                        </div>
                        <Text className='login-text-p'>Sign in to see what’s new.</Text>
                    </div>
                    <Form.Item
                        label={'Username'}
                        name={'email'}
                        required={true}
                        style={{marginTop: '12px'}}
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
                        <Button className='login-button' htmlType='submit' block>Login</Button>
                    </Form.Item>
                    <Form.Item style={{textAlign: 'center'}}>
                        <Text 
                        style={{fontWeight: 500, color: 'white'}}
                        >Don't have an account? <Link style={{color: '#E5383B'}} to={'/register'}>Register</Link></Text>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;