import React, { useState } from 'react';
import axios from "axios";
import { Button, Form, Input, Radio } from 'antd';

const Register = () => {

    const [data, setData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
    });

    const [form] = Form.useForm();
    const [role, setRole] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                ...data,
                role: role,
            };
            console.log(payload, payload.role)
            await axios.post("http://127.0.0.1:5000/users", payload);
            console.log(payload);
            alert("User Data Saved")
            window.location.reload();
        } catch (err) {
            alert("User failed")
        }
    }

    console.log(data);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '100px' }}>
                <Form form={form} style={{ width: '350px' }} onFinish={handleSubmit} >
                    <Form.Item 
                        label="Username" 
                    >
                        <Input 
                            placeholder='enter your username' 
                            name={'username'} 
                            value={data.username} 
                            onChange={handleChange} 
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password 
                            placeholder='enter your password' 
                            name={'password'}
                            value={data.password} 
                            onChange={handleChange} 
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Email"
                        rules={[
                            { type: "email", message: "Invalid email" },
                            { required: true, message: "Please enter email" },
                        ]}>
                        <Input 
                            placeholder='enter your email' 
                            name={'email'}
                            type={'email'} 
                            value={data.email} 
                            onChange={handleChange} 
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Phone" 
                    >
                        <Input 
                            placeholder='enter your phone number' 
                            name={'phone'} 
                            value={data.phone} 
                            onChange={handleChange} 
                        />
                    </Form.Item>

                    <Form.Item label="Role">
                        <Radio.Group 
                            value={role} 
                            onChange={(e) => { setRole(e.target.value) }}
                        >
                            <Radio value={'R1'}>Admin</Radio>
                            <Radio value={'R2'}>User</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;