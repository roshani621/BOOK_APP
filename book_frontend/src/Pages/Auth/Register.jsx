import React, { useState } from 'react';
import { Button, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../../assets/Main.css';

const Register = () => {

    const [data, setData] = useState({
        username: '',
        password: '',
        email: '',
        phone: ''
    });

    const [file, setFile] = useState(null);

    const handleFileChange = ({file}) =>{
        setFile(file.originFileObj)
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setData({...data, [name]:value });
    }

    const handleSubmit = async() =>{
        try{
            const formData = new FormData();

            formData.append("username", data.usernme);
            formData.append("password", data.password);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("photo", file);

            const res = await axios.post('http://127.0.0.1:5000/register', formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );
            console.log(res.data);
        } catch(err){
            console.log(err);
        }
    }
    return (
        <div className='register-page'>
            <div>
                <Form 
                className='form' 
                onFinish={handleSubmit}
                style={{
                    width: '450px',
                    height: '450px',
                    border: '1px solid white',
                    borderRadius: '20px',
                    padding: '30px',
                    alignContent: 'center',
                    position: 'absolute',
                    top:'10%',
                    left: '33%',
                }}>
                    <Form.Item 
                    label={'Username'}
                    rules={[
                            { required: true, message: "Please enter your username" },
                            { type: "text", message: "Enter a valid username" }
                        ]}
                    >
                        <Input placeholder='enter username' value={data.username} name='username'
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item 
                    label={'Password'}
                    rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password placeholder='enter password' value={data.password} name='password'
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item 
                    label={'Email'}
                    rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Enter a valid email" }
                        ]}
                    >
                        <Input placeholder='enter email' value={data.email} name='email'
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item 
                    label={'Phone'}
                    rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 10, message: "phone number must be 10 digit" }
                        ]}
                    >
                        <Input placeholder='enter phone number' value={data.phone} name='phone'
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                    label={'Upload Photo'}
                    > 
                        <Upload 
                        beforeUpload={()=>false}
                        onChange={handleFileChange}
                        maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' style={{
                            width: '100%',
                        }}>Register</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;