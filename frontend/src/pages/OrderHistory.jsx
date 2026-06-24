import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Typography, Empty, Button, Spin, List, message, 
  Popconfirm, Modal, Form, Select, Input, Upload, Tabs, Tag, Space, Tooltip, Divider 
} from 'antd';
import { 
  HistoryOutlined, ShoppingOutlined, UploadOutlined, CopyOutlined, 
  SafetyCertificateOutlined, DollarCircleOutlined, ReloadOutlined, FileProtectOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND, getOrderStatusTag } from '../utils/format';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState('orders');

  // Claim Histories
  const [refundClaims, setRefundClaims] = useState([]);
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [myWarranties, setMyWarranties] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);

  // Modals state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [isViewWarrantyModalOpen, setIsViewWarrantyModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderWarranties, setOrderWarranties] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [refundForm] = Form.useForm();
  const [warrantyForm] = Form.useForm();

  useEffect(() => {
    fetchOrders();
    fetchClaimsAndWarranties();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-history');
      setOrders(response.data);
    } catch (error) {
      message.error('Không thể tải lịch sử mua hàng.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimsAndWarranties = async () => {
    try {
      setClaimsLoading(true);
      const [refundsRes, claimsRes, warrantiesRes] = await Promise.all([
        api.get('/refunds/my-claims'),
        api.get('/warranties/my-claims'),
        api.get('/warranties/my-warranties')
      ]);
      setRefundClaims(refundsRes.data);
      setWarrantyClaims(claimsRes.data);
      setMyWarranties(warrantiesRes.data);
    } catch (error) {
      console.error('Lỗi tải lịch sử yêu cầu:', error);
    } finally {
      setClaimsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/cancel`);
      message.success('Đơn hàng đã được hủy thành công!');
      fetchOrders();
    } catch (error) {
      message.error(error.response?.data?.message || 'Hủy đơn hàng thất bại.');
    }
  };

  // Cloudinary custom upload
  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await api.post('/cloudinary/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(res.data.url);
      message.success('Tải ảnh lên Cloudinary thành công!');
      onSuccess(res.data);
    } catch (err) {
      message.error('Tải ảnh thất bại. Vui lòng thử lại.');
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  // Open refund modal
  const openRefundModal = (order) => {
    setSelectedOrder(order);
    setImageUrl('');
    refundForm.resetFields();
    setIsRefundModalOpen(true);
  };

  // Submit Refund
  const handleRefundSubmit = async (values) => {
    if (!imageUrl) {
      message.error('Vui lòng tải lên ảnh chụp sản phẩm còn nguyên vẹn!');
      return;
    }
    
    const selectedItem = selectedOrder.items.find(item => item.productId === values.productId);

    try {
      await api.post('/refunds', {
        orderId: selectedOrder.id,
        productId: values.productId,
        productName: selectedItem.productName,
        sku: selectedItem.sku,
        productImage: imageUrl,
        reason: values.reason
      });
      message.success('Gửi yêu cầu hoàn tiền thành công! Vui lòng chờ admin phê duyệt.');
      setIsRefundModalOpen(false);
      fetchClaimsAndWarranties();
      setActiveTab('claims');
    } catch (error) {
      message.error(error.response?.data?.message || 'Gửi yêu cầu hoàn tiền thất bại.');
    }
  };

  // Open warranty modal
  const openWarrantyModal = (order) => {
    setSelectedOrder(order);
    setImageUrl('');
    
    // Find active warranties belonging to this order
    const warrantiesForOrder = myWarranties.filter(w => w.orderId === order.id && w.status === 'ACTIVE');
    setOrderWarranties(warrantiesForOrder);

    warrantyForm.resetFields();
    setIsWarrantyModalOpen(true);
  };

  // Submit Warranty
  const handleWarrantySubmit = async (values) => {
    if (!imageUrl) {
      message.error('Vui lòng tải lên ảnh chụp tình trạng lỗi của sản phẩm!');
      return;
    }

    const selectedWarranty = orderWarranties.find(w => w.warrantyCode === values.warrantyCode);
    
    try {
      await api.post('/warranties/claims', {
        productId: selectedWarranty.productId,
        productName: selectedWarranty.productName,
        warrantyCode: values.warrantyCode,
        issueDescription: values.issueDescription,
        productImage: imageUrl
      });
      message.success('Gửi yêu cầu bảo hành thành công! Vui lòng chờ admin xử lý.');
      setIsWarrantyModalOpen(false);
      fetchClaimsAndWarranties();
      setActiveTab('claims');
    } catch (error) {
      message.error(error.response?.data?.message || 'Gửi yêu cầu bảo hành thất bại.');
    }
  };

  // Open view warranty modal
  const openViewWarrantyModal = (order) => {
    setSelectedOrder(order);
    const warrantiesForOrder = myWarranties.filter(w => w.orderId === order.id);
    setOrderWarranties(warrantiesForOrder);
    setIsViewWarrantyModalOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép mã bảo hành!');
  };

  // Helper to check if order is eligible for refund (within 7 days of deliveryDate)
  const isEligibleForRefund = (order) => {
    if (order.orderStatus !== 'DELIVERED' || !order.deliveryDate) return false;
    const deliveryTime = new Date(order.deliveryDate).getTime();
    const now = new Date().getTime();
    const diffDays = (now - deliveryTime) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // Helper to check if order has active warranties
  const hasActiveWarranties = (order) => {
    return myWarranties.some(w => w.orderId === order.id && w.status === 'ACTIVE');
  };

  const orderColumns = [
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text copyable style={{ fontSize: '13px', fontFamily: 'monospace' }}>{id}</Text>
    },
    {
      title: 'Sản phẩm đã mua',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <List
          size="small"
          dataSource={items}
          renderItem={(item) => (
            <List.Item style={{ padding: '4px 0', border: 'none' }}>
              <div>
                <Text style={{ fontSize: '13px' }}>
                  • {item.productName} <Text type="secondary">x{item.quantity}</Text>
                </Text>
                {item.variationDetail && (
                  <div style={{ paddingLeft: '12px', fontSize: '11px', color: '#E95211', fontWeight: 600 }}>
                    Biến thể: {item.variationDetail}
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount, record) => (
        <div>
          <Text strong style={{ color: '#E95211' }}>{formatVND(amount)}</Text>
          {record.couponCode && (
            <div style={{ fontSize: '11px', marginTop: '2px', lineHeight: '1.4' }}>
              <span style={{ color: '#6b7280' }}>Mã: </span>
              <Text code style={{ fontSize: '10px', padding: '0 4px' }}>{record.couponCode}</Text>
              <div style={{ color: '#52c41a' }}>Giảm: -{formatVND(record.discountAmount)}</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status)
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.orderStatus === 'PROCESSING' && (
            <Popconfirm
              title="Xác nhận hủy đơn hàng?"
              description="Hành động này sẽ khôi phục lại số lượng sản phẩm trong kho."
              onConfirm={() => handleCancelOrder(record.id)}
              okText="Hủy đơn"
              cancelText="Quay lại"
              okButtonProps={{ danger: true }}
            >
              <Button type="primary" danger size="small" style={{ borderRadius: '4px' }}>
                Hủy đơn
              </Button>
            </Popconfirm>
          )}

          {record.orderStatus === 'DELIVERED' && (
            <Space size="small">
              <Button 
                type="default" 
                icon={<SafetyCertificateOutlined style={{ color: '#E95211' }} />} 
                size="small" 
                onClick={() => openViewWarrantyModal(record)}
              >
                Mã bảo hành
              </Button>

              {isEligibleForRefund(record) && (
                <Button 
                  type="primary" 
                  danger 
                  icon={<DollarCircleOutlined />} 
                  size="small" 
                  onClick={() => openRefundModal(record)}
                >
                  Hoàn tiền (7 ngày)
                </Button>
              )}

              {hasActiveWarranties(record) && (
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  size="small" 
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  onClick={() => openWarrantyModal(record)}
                >
                  Yêu cầu bảo hành
                </Button>
              )}
            </Space>
          )}
        </Space>
      )
    }
  ];

  const refundColumns = [
    {
      title: 'Thời gian gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr) => new Date(dateStr).toLocaleString('vi-VN')
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => <Text style={{ fontFamily: 'monospace' }}>{id}</Text>
    },
    {
      title: 'Sản phẩm hoàn tiền',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          {record.sku && <div><Text type="secondary" style={{ fontSize: '11px', fontFamily: 'monospace' }}>SKU: {record.sku}</Text></div>}
        </div>
      )
    },
    {
      title: 'Ảnh minh chứng',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (imgUrl) => <img src={imgUrl} alt="Intact product" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e0e0e0' }} />
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">ĐANG CHỜ DUYỆT</Tag>;
        if (status === 'APPROVED') return <Tag color="success">ĐÃ CHẤP THUẬN</Tag>;
        return <Tag color="error">ĐÃ TỪ CHỐI</Tag>;
      }
    },
    {
      title: 'Phản hồi từ Admin',
      dataIndex: 'adminComment',
      key: 'adminComment',
      render: (comment) => comment ? <Text type="warning">{comment}</Text> : <Text type="secondary">—</Text>
    }
  ];

  const warrantyClaimColumns = [
    {
      title: 'Thời gian gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr) => new Date(dateStr).toLocaleString('vi-VN')
    },
    {
      title: 'Mã bảo hành',
      dataIndex: 'warrantyCode',
      key: 'warrantyCode',
      render: (code) => <Text code style={{ fontFamily: 'monospace' }}>{code}</Text>
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Ảnh lỗi sản phẩm',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (imgUrl) => <img src={imgUrl} alt="Broken product" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e0e0e0' }} />
    },
    {
      title: 'Mô tả lỗi',
      dataIndex: 'issueDescription',
      key: 'issueDescription'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">ĐANG XỬ LÝ</Tag>;
        if (status === 'APPROVED') return <Tag color="success">ĐÃ BẢO HÀNH</Tag>;
        return <Tag color="error">ĐÃ TỪ CHỐI</Tag>;
      }
    },
    {
      title: 'Phản hồi từ Admin',
      dataIndex: 'adminComment',
      key: 'adminComment',
      render: (comment) => comment ? <Text type="warning">{comment}</Text> : <Text type="secondary">—</Text>
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Đang tải lịch sử mua hàng...">
          <div style={{ padding: '50px' }} />
        </Spin>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <HistoryOutlined style={{ color: '#E95211' }} /> Quản lý Đơn hàng & Bảo hành
      </Title>

      <Tabs 
        activeKey={activeTab} 
        onChange={(key) => {
          setActiveTab(key);
          if (key === 'claims') {
            fetchClaimsAndWarranties();
          }
        }}
        items={[
          {
            key: 'orders',
            label: (
              <span>
                <ShoppingOutlined /> Đơn hàng của tôi
              </span>
            ),
            children: orders.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                <Empty description="Bạn chưa thực hiện bất kỳ đơn hàng nào.">
                  <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate('/')} style={{ background: '#E95211', borderColor: '#E95211' }}>
                    Mua sắm ngay
                  </Button>
                </Empty>
              </Card>
            ) : (
              <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table 
                  dataSource={orders} 
                  columns={orderColumns} 
                  rowKey="id" 
                  pagination={{ pageSize: 5 }} 
                  scroll={{ x: 'max-content' }}
                />
              </Card>
            )
          },
          {
            key: 'claims',
            label: (
              <span>
                <FileProtectOutlined /> Yêu cầu Hoàn tiền & Bảo hành
              </span>
            ),
            children: (
              <Spin spinning={claimsLoading}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card title={<span style={{ color: '#E95211' }}><DollarCircleOutlined /> Lịch sử Yêu cầu Hoàn tiền</span>} styles={{ body: { padding: 0 } }}>
                    <Table
                      dataSource={refundClaims}
                      columns={refundColumns}
                      rowKey="id"
                      pagination={{ pageSize: 3 }}
                      locale={{ emptyText: 'Chưa gửi yêu cầu hoàn tiền nào.' }}
                      scroll={{ x: 'max-content' }}
                    />
                  </Card>

                  <Card title={<span style={{ color: '#52c41a' }}><SafetyCertificateOutlined /> Lịch sử Yêu cầu Bảo hành</span>} styles={{ body: { padding: 0 } }}>
                    <Table
                      dataSource={warrantyClaims}
                      columns={warrantyClaimColumns}
                      rowKey="id"
                      pagination={{ pageSize: 3 }}
                      locale={{ emptyText: 'Chưa gửi yêu cầu bảo hành nào.' }}
                      scroll={{ x: 'max-content' }}
                    />
                  </Card>
                </Space>
              </Spin>
            )
          }
        ]}
      />

      {/* --- MODAL HOÀN TIỀN --- */}
      <Modal
        title={<strong><DollarCircleOutlined style={{ color: '#E95211' }} /> GỬI YÊU CẦU HOÀN TIỀN</strong>}
        open={isRefundModalOpen}
        onCancel={() => setIsRefundModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Divider style={{ margin: '12px 0' }} />
        <Form form={refundForm} layout="vertical" onFinish={handleRefundSubmit}>
          <Form.Item 
            name="productId" 
            label="Chọn sản phẩm muốn trả & hoàn tiền" 
            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
          >
            <Select placeholder="Chọn sản phẩm trong đơn hàng">
              {selectedOrder?.items.map(item => (
                <Select.Option key={item.productId} value={item.productId}>
                  {item.productName} ({formatVND(item.price)} x{item.quantity})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Ảnh chụp xác minh sản phẩm còn nguyên vẹn">
            <Upload
              name="file"
              listType="picture"
              maxCount={1}
              customRequest={handleImageUpload}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => setImageUrl('')}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>Tải ảnh lên Cloudinary</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 10, fontSize: '12px', color: '#52c41a' }}>
                ✓ Đã lưu trữ ảnh an toàn trên Cloudinary.
              </div>
            )}
          </Form.Item>

          <Form.Item 
            name="reason" 
            label="Lý do yêu cầu hoàn tiền" 
            rules={[{ required: true, message: 'Vui lòng nhập lý do hoàn tiền!' }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do chi tiết..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsRefundModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" style={{ background: '#E95211', borderColor: '#E95211' }}>Gửi yêu cầu</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- MODAL YÊU CẦU BẢO HÀNH --- */}
      <Modal
        title={<strong><ReloadOutlined style={{ color: '#52c41a' }} /> GỬI YÊU CẦU BẢO HÀNH</strong>}
        open={isWarrantyModalOpen}
        onCancel={() => setIsWarrantyModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Divider style={{ margin: '12px 0' }} />
        <Form form={warrantyForm} layout="vertical" onFinish={handleWarrantySubmit}>
          <Form.Item 
            name="warrantyCode" 
            label="Chọn sản phẩm & Mã bảo hành" 
            rules={[{ required: true, message: 'Vui lòng chọn thẻ bảo hành!' }]}
          >
            <Select placeholder="Chọn thẻ bảo hành đang hoạt động">
              {orderWarranties.map(w => (
                <Select.Option key={w.warrantyCode} value={w.warrantyCode}>
                  {w.productName} (Mã: {w.warrantyCode})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Ảnh chụp tình trạng lỗi của sản phẩm">
            <Upload
              name="file"
              listType="picture"
              maxCount={1}
              customRequest={handleImageUpload}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => setImageUrl('')}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>Tải ảnh lên Cloudinary</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 10, fontSize: '12px', color: '#52c41a' }}>
                ✓ Đã lưu trữ ảnh an toàn trên Cloudinary.
              </div>
            )}
          </Form.Item>

          <Form.Item 
            name="issueDescription" 
            label="Mô tả tình trạng lỗi/hỏng của sản phẩm" 
            rules={[{ required: true, message: 'Vui lòng mô tả tình trạng sản phẩm!' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết sản phẩm bị lỗi hỏng ra sao..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsWarrantyModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" style={{ background: '#52c41a', borderColor: '#52c41a' }}>Gửi yêu cầu</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- MODAL XEM MÃ BẢO HÀNH --- */}
      <Modal
        title={<strong><SafetyCertificateOutlined style={{ color: '#E95211' }} /> DANH SÁCH MÃ BẢO HÀNH SẢN PHẨM</strong>}
        open={isViewWarrantyModalOpen}
        onCancel={() => setIsViewWarrantyModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewWarrantyModalOpen(false)} style={{ background: '#E95211', borderColor: '#E95211' }}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        <Divider style={{ margin: '12px 0' }} />
        <Text type="secondary" style={{ display: 'block', marginBottom: '15px' }}>
          Dưới đây là danh sách thẻ bảo hành điện tử tự động sinh cho các sản phẩm thuộc đơn hàng **#{selectedOrder?.id}**. Hãy sao chép mã khi cần yêu cầu dịch vụ bảo hành.
        </Text>
        <List
          dataSource={orderWarranties}
          renderItem={(w) => (
            <List.Item 
              style={{ padding: '12px 0' }}
              actions={[
                <Tooltip title="Sao chép mã bảo hành">
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(w.warrantyCode)} size="small" />
                </Tooltip>
              ]}
            >
              <List.Item.Meta
                title={<strong>{w.productName}</strong>}
                description={
                  <Space direction="vertical" size={0}>
                    <Text style={{ fontSize: '13px' }}>
                      Mã bảo hành: <Text code style={{ fontFamily: 'monospace', fontWeight: 600 }}>{w.warrantyCode}</Text>
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Hạn bảo hành: {new Date(w.expiryDate).toLocaleDateString('vi-VN')}
                    </Text>
                    <div>
                      Trạng thái: {' '}
                      {w.status === 'ACTIVE' && <Tag color="success">ĐANG HOẠT ĐỘNG</Tag>}
                      {w.status === 'CLAIMED' && <Tag color="warning">ĐÃ SỬ DỤNG</Tag>}
                      {w.status === 'EXPIRED' && <Tag color="error">HẾT HẠN</Tag>}
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: 'Đơn hàng chưa được cấp mã bảo hành (Chỉ cấp khi trạng thái đơn là DELIVERED).' }}
        />
      </Modal>
    </div>
  );
}
