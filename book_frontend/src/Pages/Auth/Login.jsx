import React, { useState } from 'react';
import { Form, Input, Typography, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'antd/es/form/Form';
import '../../assets/Main.css';

const {Text} = Typography;
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

    const handleSubmit = async (values) => {
        try {
            const res = await axios.post('http://127.0.0.1:5000/login', values);
            console.log(res);
            alert(res.data.message);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='form-page'>
            <div style={{
                width: '400px',
                height: '350px',
                border: '1px solid white',
                borderRadius: '20px',
                padding: '40px',
                position: 'absolute',
                top: '10%',
                left: '33%'
            }} className='form'>
                <Form form={form} layout='vertical' onFinish={handleSubmit} style={{marginTop:'40px'}}>
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
                    <Form.Item style={{textAlign: 'center'}}>
                        <Text type='primary'
                        style={{fontWeight: '30px', color: 'white'}}
                        >Don't have an account? <Link style={{color: '#ABD9FF'}} to={'/register'}>Register</Link></Text>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;