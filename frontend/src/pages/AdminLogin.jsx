import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

export default function AdminLogin({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', values);
      const { token, refreshToken, username, role, fullName } = response.data;
      
      if (role !== 'ADMIN') {
        setErrorMsg('Truy cập bị từ chối. Tài khoản của bạn không có quyền Quản trị viên.');
        setLoading(false);
        return;
      }

      // Store token for WebSocket STOMP authentication
      localStorage.setItem('admin_token', token);
      if (refreshToken) localStorage.setItem('admin_refreshToken', refreshToken);

      message.success(`Chào mừng Admin quay lại, ${fullName}!`);
      onLoginSuccess({ username, role, fullName });
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu quản trị không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '24px' 
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', 
          borderRadius: '16px',
          border: '1px solid #334155',
          background: '#1e293b'
        }}
        styles={{ body: { padding: '36px 24px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'rgba(233, 82, 17, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #DC2626'
          }}>
            <SafetyCertificateOutlined style={{ fontSize: '28px', color: '#DC2626' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#ffffff', fontWeight: 800 }}>ĐĂNG NHẬP ADMIN</Title>
          <Text style={{ color: '#94a3b8', display: 'block', marginTop: '8px' }}>Bảng điều khiển hệ thống cửa hàng AndrewSport</Text>
        </div>

        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: '20px', borderRadius: '8px' }} />
        )}

        <Form
          name="admin_login_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng điền tên đăng nhập quản trị!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Tên đăng nhập Admin" 
              size="large"
              style={{ background: '#0f172a', border: '1px solid #475569', color: '#ffffff', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng điền mật khẩu quản trị!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Mật khẩu Admin" 
              size="large"
              style={{ background: '#0f172a', border: '1px solid #475569', color: '#ffffff', borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '28px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={loading} 
              style={{ 
                borderRadius: '8px', 
                background: '#DC2626', 
                borderColor: '#DC2626', 
                fontWeight: 700,
                height: '46px'
              }}
            >
              Đăng nhập quản trị
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button type="link" onClick={() => navigate('/')} style={{ color: '#94a3b8', padding: 0 }}>
            Quay lại trang mua sắm
          </Button>
        </div>
      </Card>
    </div>
  );
}
