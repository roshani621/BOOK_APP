import { Avatar, Button, Form, Input, Typography } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const Login = () => {

    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmit = async () => {
        try {
            console.log(email)
            const res = await axios.post("http://127.0.0.1:5000/login", {
                email: data.email,
                password: data.password
            })
            console.log(res.data);
            localStorage.setItem("b_role_id", res.data.user.role_id)
            localStorage.setItem("b_user_id", res.data.user.id)
            alert("User Login Successfully 🚀")
            navigate('/dashboard')
            
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Invalid Email or Password");
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '70px',
            background: 'linear-gradient(to left, #fb7185, #a21caf, #6366f1)',
            minHeight: '100vh', margin: '0', padding: '0'
         }}>
            <div>
                
            </div>
            <div style={{
                width: '400px',
                height: '350px',
                border:'1px solid white',
                borderRadius: '30px',
                marginTop: '100px',
                marginRight: '310px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(16px)'
            }}>
                <Form onFinish={handleSubmit}>

                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', marginTop: '30px'
                    }}>
                        <Title level={4} style={{ marginBottom: '30px' }}>Sign In</Title>
                        <Form.Item
                            label='Email'
                            name={'email'}
                            style={{ width: '330px' }}
                            rules={[{ required: true, message: 'please enter username' },
                                { type: "email", message: "Enter a valid email address" }
                            ]}
                        >
                            <Input name='email'
                                value={data.email} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item
                            label='Password'
                            name={'password'}
                            style={{ width: '330px' }}
                            rules={[{ required: true, message: 'please enter password' },
                                {
                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                                    message: "Password must contain letters and numbers"
                                }
                            ]}
                        >
                            <Input.Password name='password' style={{borderRadius: '15px',
                                borderColor: '#ff7e5f'
                            }}
                                value={data.password} onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label={null}
                        >   <Button type='primary'
                            style={{
                                marginTop: '30px',
                                width: '100px'
                            }}
                            htmlType='submit'
                            
                         block>
                                Login
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Text>Don't have an account?
                                <Link to={'/register'}> <Text>Sign Up</Text></Link>
                            </Text>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;