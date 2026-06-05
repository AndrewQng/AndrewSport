import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, Space, Steps, Result, Spin, message, Radio } from 'antd';
import { CreditCardOutlined, UserOutlined, HomeOutlined, WalletOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND } from '../utils/format';

const { Title, Text } = Typography;

export default function Checkout({ cart, user, onClearCart }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [createdOrder, setCreatedOrder] = useState(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      message.warning('Vui lòng nhập mã giảm giá.');
      return;
    }

    let discount = 0;
    if (code === 'ANDREW20') {
      discount = totalPrice * 0.2;
      if (discount > 500000) discount = 500000;
    } else if (code === 'WELCOMESPORT') {
      discount = 100000;
      if (discount > totalPrice) discount = totalPrice;
    } else if (code === 'PICKLEBALL') {
      discount = 50000;
      if (discount > totalPrice) discount = totalPrice;
    } else {
      message.error('Mã giảm giá không hợp lệ!');
      return;
    }

    setAppliedCoupon(code);
    setDiscountAmount(discount);
    message.success(`Áp dụng mã giảm giá ${code} thành công!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscountAmount(0);
    setCouponInput('');
    message.info('Đã hủy áp dụng mã giảm giá.');
  };

  const handleNext = (values) => {
    setFormData(prev => ({ ...prev, ...values }));
    setCurrentStep(currentStep + 1);
  };

  const handleCheckoutSubmit = async (paymentValues) => {
    setLoading(true);
    const finalData = { ...formData, ...paymentValues };
    
    const orderItems = cart.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    }));

    const orderPayload = {
      userId: user?.id || 'anonymous',
      customerName: finalData.fullName,
      items: orderItems,
      totalAmount: totalPrice - discountAmount,
      paymentMethod: paymentMethod === 'card' ? 'CREDIT_CARD' : 'E_WALLET',
      shippingAddress: `${finalData.address}, ${finalData.city}`,
      couponCode: appliedCoupon || null,
      discountAmount: discountAmount || 0.0
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await api.post('/orders', orderPayload);
      setCreatedOrder(response.data);
      onClearCart();
      setCurrentStep(2);
      message.success('Thanh toán thành công! Đơn hàng đã được ghi nhận.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Thanh toán thất bại. Vui lòng kiểm tra lại số lượng tồn kho hoặc tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Địa chỉ giao hàng' },
    { title: 'Thanh toán' },
    { title: 'Hoàn tất' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

      {currentStep === 0 && (
        <Card title={<span style={{ fontWeight: 700 }}>Thông tin giao hàng</span>}>
          <Form layout="vertical" onFinish={handleNext} initialValues={{ fullName: user?.fullName || '' }}>
            <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên của bạn' }]}>
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ nhận hàng" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng' }]}>
              <Input prefix={<HomeOutlined />} placeholder="Số 123 Đường Nguyễn Trãi, Quận 1" size="large" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="city" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng nhập Tỉnh/Thành phố' }]}>
                  <Input placeholder="Hồ Chí Minh" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Số điện thoại liên lạc" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                  <Input placeholder="0987654321" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: 16, background: '#DC2626', borderColor: '#DC2626', fontWeight: 700 }}>
              Tiếp tục thanh toán
            </Button>
          </Form>
        </Card>
      )}

      {currentStep === 1 && (
        <Spin spinning={loading} tip="Đang xác thực giao dịch...">
          <Card title={<span style={{ fontWeight: 700 }}>Thực hiện thanh toán</span>}>
            {/* Voucher / Coupon Code input */}
            <div style={{ marginBottom: 24, padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, fontSize: '14px' }}>Voucher / Mã giảm giá</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  placeholder="Nhập mã (Ví dụ: ANDREW20, WELCOMESPORT, PICKLEBALL)"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  disabled={!!appliedCoupon}
                  size="large"
                />
                {!appliedCoupon ? (
                  <Button type="primary" onClick={handleApplyCoupon} size="large" style={{ background: '#111827', borderColor: '#111827', fontWeight: 600 }}>
                    Áp dụng
                  </Button>
                ) : (
                  <Button danger onClick={handleRemoveCoupon} size="large" style={{ fontWeight: 600 }}>
                    Hủy bỏ
                  </Button>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#6b7280' }}>
                Mã giảm giá có sẵn: <Text code>ANDREW20</Text> (giảm 20% tối đa 500k), <Text code>WELCOMESPORT</Text> (giảm 100k), <Text code>PICKLEBALL</Text> (giảm 50k)
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ marginBottom: 24, padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>Tạm tính:</Text>
                <Text strong style={{ fontSize: '14px' }}>{formatVND(totalPrice)}</Text>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text type="success" style={{ fontSize: '14px' }}>Giảm giá ({appliedCoupon}):</Text>
                  <Text type="success" strong style={{ fontSize: '14px' }}>-{formatVND(discountAmount)}</Text>
                </div>
              )}
              <div style={{ borderTop: '1px dashed #e8e8e8', margin: '8px 0', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 16 }}>Tổng thanh toán:</Text>
                <Text strong style={{ fontSize: 20, color: '#DC2626', fontWeight: 900 }}>
                  {formatVND(totalPrice - discountAmount)}
                </Text>
              </div>
            </div>

            <Radio.Group 
              value={paymentMethod} 
              onChange={e => setPaymentMethod(e.target.value)} 
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
            >
              <Radio.Button value="card" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CreditCardOutlined /> Thẻ Tín dụng/Ghi nợ
              </Radio.Button>
              <Radio.Button value="wallet" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <WalletOutlined /> Ví điện tử (Demo)
              </Radio.Button>
            </Radio.Group>

            <Form layout="vertical" onFinish={handleCheckoutSubmit}>
              {paymentMethod === 'card' ? (
                <>
                  <Form.Item name="cardNumber" label="Số thẻ ngân hàng" rules={[{ required: true, message: 'Vui lòng nhập số thẻ' }, { len: 16, message: 'Số thẻ phải chứa 16 chữ số' }]}>
                    <Input prefix={<CreditCardOutlined />} placeholder="4111222233334444" maxLength={16} size="large" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="expiry" label="Ngày hết hạn" rules={[{ required: true, message: 'Yêu cầu điền định dạng MM/YY' }]}>
                        <Input placeholder="12/28" maxLength={5} size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="cvv" label="Mã CVV" rules={[{ required: true, message: 'Yêu cầu CVV' }, { len: 3, message: 'CVV gồm 3 chữ số' }]}>
                        <Input placeholder="123" maxLength={3} size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <Form.Item name="walletId" label="Mã ví điện tử mô phỏng" rules={[{ required: true, message: 'Nhập ID ví của bạn' }]}>
                  <Input prefix={<WalletOutlined />} placeholder="vi-demo@viettelpay" size="large" />
                </Form.Item>
              )}

              <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
                <Button size="large" onClick={() => setCurrentStep(0)}>Quay lại</Button>
                <Button type="primary" htmlType="submit" size="large" style={{ minWidth: 180, background: '#DC2626', borderColor: '#DC2626', fontWeight: 700 }}>
                  Thanh toán & Đặt hàng
                </Button>
              </Space>
            </Form>
          </Card>
        </Spin>
      )}

      {currentStep === 2 && (
        <Card>
          <Result
            status="success"
            title="Đơn hàng của bạn đã đặt thành công!"
            subTitle={`Mã đơn hàng: ${createdOrder?.id || 'N/A'}. Cảm ơn bạn đã tin tưởng mua sắm tại AndrewSport.`}
            extra={[
              <Button type="primary" key="shop" onClick={() => navigate('/')} style={{ background: '#DC2626', borderColor: '#DC2626', fontWeight: 600 }}>
                Tiếp tục mua sắm
              </Button>,
              <Button key="history" onClick={() => navigate('/order-history')}>
                Lịch sử mua hàng
              </Button>,
            ]}
          />
        </Card>
      )}
    </div>
  );
}
