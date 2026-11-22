import React, { useState } from 'react';
import { Button, Form, Input, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../../assets/Main.css';
import { Link } from 'react-router-dom';
import { FaUserPlus } from "react-icons/fa";
import {showNotification} from '../../Components/NotificationMessage';

const { Text, Title } = Typography;

const Register = () => {

    const [form] = Form.useForm();
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append("username", values.username);
            formData.append("password", values.password);
            formData.append("email", values.email);
            formData.append("phone", values.phone);

            if (file) {
                formData.append("photo", file);
            }

            console.log("FILE:", file);

            const res = await axios.post('http://127.0.0.1:5000/register', formData);

            console.log(res.data);
            showNotification(
                'success',
                'Account Created!',
                'Welcome to your library. Your account has been registered successfully.'
            );
            form.resetFields();
            setFile(null);
        } catch (err) {
            showNotification(
                'error',
                'Registration Failed!',
                'Email address is already registered.'
            );
        }
    }
    return (
        <div className='register-page'>
            <div>
                <Form
                    form={form}
                    layout='vertical'
                    className='form'
                    onFinish={handleSubmit}
                    style={{
                        width: '470px',
                        height: 'auto',
                        border: '1px solid white',
                        borderRadius: '20px',
                        padding: '30px',
                        alignContent: 'center',
                        position: 'absolute',
                        top: '9%',
                        left: '60%',
                    }}>
                    <div>
                        <div style={{
                            display: 'flex', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Title className='login-title' level={4}>
                                <FaUserPlus size={25} style={{ marginRight: '15px', color: '#C92D30' }} />
                                Start your library</Title>
                        </div>
                    </div>
                    <Form.Item
                        name={'username'}
                        label={'Username'}
                        rules={[
                            { required: true, message: "Please enter your username" },
                            { type: "text", message: "Enter a valid username" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'Password'}
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name={'email'}
                        label={'Email'}
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={'phone'}
                        label={'Phone'}
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 10, message: "phone number must be 10 digit" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={'Upload Photo'}
                    >
                        <Upload
                            beforeUpload={() => false}
                            onChange={(info) => {
                                const selectedFile = info.fileList[0]?.originFileObj;
                                setFile(selectedFile || null);
                            }}
                            maxCount={1}
                            accept={'image/*'}
                            fileList={file ? [{
                                uid: file.uid,
                                name: file.name,
                                status: 'done'
                            }] : []}
                            onRemove={() => {
                                setFile(null);
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button block htmlType='submit' className='login-button'
                        >Create account</Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            gap: '10px',
                        }}>
                            <Text style={{
                                fontWeight: 400, fontSize: '14.5px', color: 'white'
                            }}>Already have an account?
                            </Text>
                            <Link to={'/login'}>
                                <Text style={{
                                    color: '#E5383B',
                                    fontSize: '15px', fontWeight: 500
                                }}>Login</Text>
                            </Link> </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;