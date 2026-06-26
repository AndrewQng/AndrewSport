import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message, Modal, Divider, Spin } from 'antd';
import { UserOutlined, LockOutlined, FacebookFilled, LoadingOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

export default function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Forgot Password States
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & mật khẩu mới
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);

  // Social Login States
  const [socialVisible, setSocialVisible] = useState(false);
  const [socialProvider, setSocialProvider] = useState(''); // 'Google' hoặc 'Facebook'
  const [socialStep, setSocialStep] = useState(1); // 1: Connecting..., 2: Profile Selection
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  const [forgotEmailForm] = Form.useForm();
  const [forgotResetForm] = Form.useForm();

  useEffect(() => {
    let timer;
    if (forgotCountdown > 0) {
      timer = setTimeout(() => setForgotCountdown(forgotCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotCountdown]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', values);
      const { token, refreshToken, username, role, fullName } = response.data;
      
      if (role === 'ADMIN') {
        setErrorMsg('Truy cập bị từ chối. Vui lòng sử dụng trang đăng nhập Admin dành riêng cho Quản trị viên.');
        setLoading(false);
        return;
      }

      // Store token for WebSocket STOMP authentication
      localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      message.success(`Chào mừng quay lại, ${fullName}!`);
      onLoginSuccess({ username, role, fullName });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Flows
  const handleSendForgotOtp = async (values) => {
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password/send-otp', {
        email: values.email,
        type: 'FORGOT_PASSWORD'
      });
      setForgotEmail(values.email);
      setForgotStep(2);
      setForgotCountdown(60);
      message.success('Mã OTP đã được gửi đến email của bạn!');
    } catch (err) {
      message.error(err.response?.data?.message || 'Gửi mã OTP thất bại. Vui lòng kiểm tra lại email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password/reset', {
        email: forgotEmail,
        otp: values.otp,
        newPassword: values.newPassword
      });
      message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      setForgotVisible(false);
      forgotEmailForm.resetFields();
      forgotResetForm.resetFields();
      setForgotStep(1);
    } catch (err) {
      message.error(err.response?.data?.message || 'Mã xác thực không đúng hoặc đã hết hạn.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResendForgotOtp = async () => {
    if (forgotCountdown > 0) return;
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password/send-otp', {
        email: forgotEmail,
        type: 'FORGOT_PASSWORD'
      });
      message.success('Mã OTP mới đã được gửi!');
      setForgotCountdown(60);
    } catch (err) {
      message.error(err.response?.data?.message || 'Gửi lại mã OTP thất bại.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Social Login Simulated Consent popup
  const handleOpenSocialLogin = (provider) => {
    setSocialProvider(provider);
    setSocialVisible(true);
    setSocialStep(1);
    setSocialEmail('');
    setSocialName('');
    
    // Simulate loading/connecting screen for 1 second
    setTimeout(() => {
      setSocialStep(2);
    }, 1000);
  };

  const handleSelectSocialProfile = async (email, name) => {
    setSocialLoading(true);
    try {
      const payload = {
        provider: socialProvider.toUpperCase(),
        email: email,
        fullName: name,
        providerId: providerIdFromEmail(email)
      };

      const response = await api.post('/auth/social-login', payload);
      const { token, refreshToken, username, role, fullName } = response.data;

      message.success(`Đăng nhập bằng ${socialProvider} thành công! Chào mừng, ${fullName}!`);
      onLoginSuccess({ username, role, fullName });
      setSocialVisible(false);
      navigate('/');
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng nhập mạng xã hội thất bại.');
    } finally {
      setSocialLoading(false);
    }
  };

  const handleCustomSocialSubmit = () => {
    if (!socialEmail || !socialName) {
      message.error('Vui lòng điền đầy đủ Email và Họ tên!');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(socialEmail)) {
      message.error('Định dạng email không đúng!');
      return;
    }
    handleSelectSocialProfile(socialEmail, socialName);
  };

  const providerIdFromEmail = (email) => {
    return 'social_' + email.replace(/[^a-zA-Z0-9]/g, '');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0, color: '#DC2626' }}>Đăng Nhập</Title>
          <Text type="secondary">Chào mừng bạn ghé thăm AndrewSport</Text>
        </div>

        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: '16px' }} />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng điền tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', marginTop: '-8px' }}>
            <Button type="link" onClick={() => { setForgotVisible(true); setForgotStep(1); }} style={{ padding: 0, color: '#DC2626', fontSize: '13px' }}>
              Quên mật khẩu?
            </Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ borderRadius: '8px', background: '#DC2626', borderColor: '#DC2626', fontWeight: 700 }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          <span style={{ padding: '0 12px', fontSize: '13px', color: '#9CA3AF' }}>Hoặc đăng nhập bằng</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <Button 
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.45-1.11 2.68-2.34 3.5v2.9h3.77c2.2-2.03 3.71-5 3.71-8.33z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.9l-3.77-2.9c-1.04.7-2.38 1.1-4.19 1.1-3.24 0-5.97-2.18-6.95-5.1H1.307v3c2 3.98 6.1 6.6 10.693 6.6z"/>
                <path fill="#FBBC05" d="M5.05 14.2c-.25-.7-.39-1.47-.39-2.2s.14-1.5.39-2.2v-3H1.307C.47 8.5 0 10.2 0 12s.47 3.5 1.307 5.2l3.743-3z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.4C17.96 1.19 15.24 0 12 0 7.4 0 3.3 2.62 1.307 6.6l3.743 3c.98-2.92 3.71-5.1 6.95-5.1z"/>
              </svg>
            }
            block 
            size="large" 
            onClick={() => handleOpenSocialLogin('Google')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #D1D5DB', fontWeight: 500 }}
          >
            Google
          </Button>
          <Button 
            type="primary"
            icon={<FacebookFilled style={{ fontSize: '18px' }} />}
            block 
            size="large" 
            onClick={() => handleOpenSocialLogin('Facebook')}
            style={{ background: '#1877F2', borderColor: '#1877F2', borderRadius: '8px', fontWeight: 500 }}
          >
            Facebook
          </Button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0, color: '#DC2626' }}>Đăng ký ngay</Button>
        </div>
      </Card>

      {/* Forgot Password Modal */}
      <Modal
        title={<div style={{ color: '#DC2626', fontSize: '18px', fontWeight: 700 }}>Đặt Lại Mật Khẩu</div>}
        open={forgotVisible}
        onCancel={() => setForgotVisible(false)}
        footer={null}
        destroyOnClose
        width={400}
      >
        {forgotStep === 1 ? (
          <Form
            form={forgotEmailForm}
            onFinish={handleSendForgotOtp}
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Vui lòng điền địa chỉ email đã đăng ký. Hệ thống sẽ gửi một mã xác thực OTP 6 số đến Gmail của bạn.
            </Text>
            <Form.Item
              name="email"
              label="Địa chỉ Email"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                { type: 'email', message: 'Địa chỉ email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập địa chỉ email" size="large" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={forgotLoading}
              style={{ background: '#DC2626', borderColor: '#DC2626', borderRadius: '8px', fontWeight: 700, marginTop: '8px' }}
            >
              Gửi mã xác minh
            </Button>
          </Form>
        ) : (
          <Form
            form={forgotResetForm}
            onFinish={handleResetPassword}
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            <Alert
              message={`Mã OTP đã được gửi đến: ${forgotEmail}`}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#DC2626', background: '#FEF2F2', padding: '8px', borderRadius: '6px', border: '1px solid #FEE2E2', marginBottom: '16px', fontWeight: 500 }}>
              💡 Lưu ý: Nếu chưa cấu hình mail, vui lòng kiểm tra Console log ở Backend để lấy mã OTP.
            </div>

            <Form.Item
              name="otp"
              label="Mã xác thực OTP (6 số)"
              rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }, { len: 6, message: 'Mã OTP gồm đúng 6 chữ số!' }]}
            >
              <Input prefix={<SafetyOutlined />} placeholder="Nhập mã OTP" size="large" maxLength={6} />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" size="large" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" size="large" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={forgotLoading}
              style={{ background: '#DC2626', borderColor: '#DC2626', borderRadius: '8px', fontWeight: 700, marginTop: '8px' }}
            >
              Đặt lại mật khẩu
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <Button type="link" onClick={() => setForgotStep(1)} style={{ padding: 0, color: '#6B7280' }}>
                Quay lại
              </Button>
              {forgotCountdown > 0 ? (
                <Text type="secondary">Gửi lại mã sau {forgotCountdown}s</Text>
              ) : (
                <Button type="link" onClick={handleResendForgotOtp} style={{ padding: 0, color: '#DC2626', fontWeight: 600 }}>
                  Gửi lại mã OTP
                </Button>
              )}
            </div>
          </Form>
        )}
      </Modal>

      {/* Social Login Consent Popup Modal */}
      <Modal
        open={socialVisible}
        onCancel={() => !socialLoading && setSocialVisible(false)}
        footer={null}
        destroyOnClose
        closable={!socialLoading}
        width={440}
        styles={{ body: { padding: '24px 32px' } }}
      >
        {socialStep === 1 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: socialProvider === 'Google' ? '#EA4335' : '#1877F2' }} spin />} />
            <Title level={4} style={{ marginTop: '24px', fontWeight: 600 }}>
              Đang kết nối tới {socialProvider}...
            </Title>
            <Text type="secondary">Vui lòng đợi trong giây lát</Text>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {socialProvider === 'Google' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" style={{ marginBottom: '12px' }}>
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.45-1.11 2.68-2.34 3.5v2.9h3.77c2.2-2.03 3.71-5 3.71-8.33z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.9l-3.77-2.9c-1.04.7-2.38 1.1-4.19 1.1-3.24 0-5.97-2.18-6.95-5.1H1.307v3c2 3.98 6.1 6.6 10.693 6.6z"/>
                  <path fill="#FBBC05" d="M5.05 14.2c-.25-.7-.39-1.47-.39-2.2s.14-1.5.39-2.2v-3H1.307C.47 8.5 0 10.2 0 12s.47 3.5 1.307 5.2l3.743-3z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.4C17.96 1.19 15.24 0 12 0 7.4 0 3.3 2.62 1.307 6.6l3.743 3c.98-2.92 3.71-5.1 6.95-5.1z"/>
                </svg>
              ) : (
                <FacebookFilled style={{ fontSize: '40px', color: '#1877F2', marginBottom: '12px' }} />
              )}
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                Đăng nhập bằng tài khoản {socialProvider}
              </Title>
              <Text type="secondary">Để tiếp tục truy cập vào ứng dụng AndrewSport</Text>
            </div>

            <Divider orientation="left" style={{ margin: '16px 0 12px 0' }}>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Chọn tài khoản thử nghiệm nhanh</span>
            </Divider>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div 
                onClick={() => !socialLoading && handleSelectSocialProfile(`user_${socialProvider.toLowerCase()}_1@gmail.com`, 'Nguyễn Văn A')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px', 
                  cursor: socialLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  background: '#F9FAFB'
                }}
                onMouseEnter={(e) => { if(!socialLoading) e.currentTarget.style.background = '#F3F4F6'; }}
                onMouseLeave={(e) => { if(!socialLoading) e.currentTarget.style.background = '#F9FAFB'; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: socialProvider === 'Google' ? '#EA4335' : '#1877F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px' }}>
                  A
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Nguyễn Văn A</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>user_{socialProvider.toLowerCase()}_1@gmail.com</div>
                </div>
              </div>

              <div 
                onClick={() => !socialLoading && handleSelectSocialProfile(`user_${socialProvider.toLowerCase()}_2@gmail.com`, 'Trần Thị B')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px', 
                  cursor: socialLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  background: '#F9FAFB'
                }}
                onMouseEnter={(e) => { if(!socialLoading) e.currentTarget.style.background = '#F3F4F6'; }}
                onMouseLeave={(e) => { if(!socialLoading) e.currentTarget.style.background = '#F9FAFB'; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: socialProvider === 'Google' ? '#F59E0B' : '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px' }}>
                  B
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Trần Thị B</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>user_{socialProvider.toLowerCase()}_2@gmail.com</div>
                </div>
              </div>
            </div>

            <Divider orientation="left" style={{ margin: '12px 0' }}>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Hoặc nhập tài khoản tùy chọn</span>
            </Divider>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <Text style={{ fontSize: '13px', fontWeight: 500 }}>Họ và tên:</Text>
                <Input 
                  placeholder="Nhập họ và tên" 
                  value={socialName} 
                  onChange={(e) => setSocialName(e.target.value)}
                  disabled={socialLoading}
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <Text style={{ fontSize: '13px', fontWeight: 500 }}>Email đăng nhập:</Text>
                <Input 
                  placeholder="Nhập email đăng nhập" 
                  value={socialEmail} 
                  onChange={(e) => setSocialEmail(e.target.value)}
                  disabled={socialLoading}
                  style={{ marginTop: '4px' }}
                />
              </div>
              
              <Button
                type="primary"
                size="large"
                loading={socialLoading}
                onClick={handleCustomSocialSubmit}
                style={{ 
                  marginTop: '12px', 
                  borderRadius: '8px', 
                  background: socialProvider === 'Google' ? '#EA4335' : '#1877F2', 
                  borderColor: socialProvider === 'Google' ? '#EA4335' : '#1877F2', 
                  fontWeight: 700 
                }}
              >
                Đồng ý và Đăng nhập
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
