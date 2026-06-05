import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

export default function Register({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Step 1: Send registration OTP
      await api.post('/auth/register/send-otp', {
        email: values.email,
        username: values.username
      });
      setFormData(values);
      setOtpSent(true);
      setCountdown(60);
      message.success('Mã xác minh OTP đã được gửi qua email của bạn!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gửi mã xác minh thất bại. Tên đăng nhập hoặc email có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegister = async () => {
    if (!otp || otp.trim().length !== 6) {
      message.error('Vui lòng nhập mã OTP gồm 6 chữ số!');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        otp: otp
      };
      const response = await api.post('/auth/register/verify-otp', payload);
      const { token, refreshToken, username, role, fullName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      message.success(`Đăng ký tài khoản thành công! Chào mừng bạn, ${fullName}!`);
      onLoginSuccess({ username, role, fullName });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Mã xác minh không chính xác hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/auth/register/send-otp', {
        email: formData.email,
        username: formData.username
      });
      message.success('Mã OTP mới đã được gửi!');
      setCountdown(60);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gửi lại mã OTP thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0, color: '#DC2626' }}>Đăng Ký Thành Viên</Title>
          <Text type="secondary">Tạo tài khoản mua sắm dụng cụ thể thao</Text>
        </div>

        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: '16px' }} />
        )}

        {!otpSent ? (
          <Form
            name="register_form"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
            </Form.Item>

            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn!' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Họ và tên của bạn" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                { type: 'email', message: 'Địa chỉ email không đúng định dạng!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Địa chỉ Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ borderRadius: '8px', background: '#DC2626', borderColor: '#DC2626', fontWeight: 700 }}>
                Gửi mã xác minh OTP qua Gmail
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Alert
              message={`Mã OTP đã được gửi đến email: ${formData.email}.`}
              description="Vui lòng kiểm tra hộp thư để lấy mã xác thực gồm 6 chữ số."
              type="info"
              showIcon
            />
            
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#DC2626', background: '#FEF2F2', padding: '8px', borderRadius: '6px', border: '1px solid #FEE2E2', fontWeight: 500 }}>
              💡 Lưu ý: Nếu chưa cấu hình mail, vui lòng kiểm tra Console log ở Backend để lấy mã OTP.
            </div>

            <div>
              <Text strong>Mã xác minh OTP:</Text>
              <Input
                placeholder="Nhập 6 số OTP"
                size="large"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ marginTop: '8px', textAlign: 'center', fontSize: '18px', letterSpacing: '6px', fontWeight: 'bold' }}
              />
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={handleVerifyRegister}
              style={{ borderRadius: '8px', background: '#DC2626', borderColor: '#DC2626', fontWeight: 700 }}
            >
              Xác thực và Đăng ký
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <Button type="link" onClick={() => setOtpSent(false)} style={{ padding: 0, color: '#6B7280' }}>
                Quay lại sửa thông tin
              </Button>
              {countdown > 0 ? (
                <Text type="secondary">Gửi lại mã sau {countdown}s</Text>
              ) : (
                <Button type="link" onClick={handleResendOtp} style={{ padding: 0, color: '#DC2626', fontWeight: 600 }}>
                  Gửi lại mã OTP
                </Button>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0, color: '#DC2626' }}>Đăng nhập ngay</Button>
        </div>
      </Card>
    </div>
  );
}
