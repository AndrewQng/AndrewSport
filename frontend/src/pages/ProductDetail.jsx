import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Tag, Space, Table, Tabs, Card, Breadcrumb, InputNumber, Alert, message, Rate, Input } from 'antd';
import { ShoppingCartOutlined, TrophyOutlined, GiftOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND } from '../utils/format';

const { Title, Text, Paragraph } = Typography;

export default function ProductDetail({ onAddToCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [userReviewComment, setUserReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      message.error('Không thể tải thông tin chi tiết sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      setReviews(response.data.reviews || []);
      setAverageRating(response.data.averageRating || 0);
      setTotalReviews(response.data.totalReviews || 0);
    } catch (error) {
      console.error('Không thể tải đánh giá sản phẩm.');
    }
  };

  const handleSubmitReview = async () => {
    if (!userReviewComment.trim()) {
      message.error('Vui lòng viết nội dung nhận xét!');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        productId: productId,
        rating: userReviewRating,
        comment: userReviewComment
      });
      message.success('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
      setUserReviewComment('');
      setUserReviewRating(5);
      fetchReviews();
    } catch (error) {
      message.error(error.response?.data?.message || 'Gửi đánh giá thất bại.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <Text type="secondary">Đang tải chi tiết sản phẩm thể thao cao cấp...</Text>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <Alert message="Không tìm thấy sản phẩm" type="error" />
        <Button onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Quay lại Trang chủ</Button>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };

  const handleBuyNowClick = () => {
    onAddToCart(product, quantity);
    navigate('/cart');
  };

  // Generate specifications table in Vietnamese
  const getSpecs = () => {
    if (product.category === 'Badminton') {
      const specsList = [
        { label: 'Thương hiệu', value: product.brand },
        { label: 'Trọng lượng / Chu vi cán', value: product.weight ? `${product.weight} / G5` : '4U / G5' },
        { label: 'Độ dẻo đũa / Độ cứng', value: product.stiffness || 'Trung Bình' },
        { label: 'Điểm cân bằng', value: product.balance || 'Cân Bằng' },
        { label: 'Chiều dài vợt', value: product.length ? `${product.length} mm` : '675 mm' },
        { label: 'Chiều dài cán vợt', value: product.gripLength ? `${product.gripLength} mm` : '205 mm' },
        { label: 'Swingweight', value: product.swingweight ? (product.swingweight === 'above88' ? 'Trên 88 kg/cm2' : product.swingweight === 'under82' ? 'Dưới 82 kg/cm2' : `${product.swingweight} kg/cm2`) : '84-86 kg/cm2' },
        { label: 'Lối chơi', value: product.playStyle || 'Công Thủ Toàn Diện' },
        { label: 'Trình độ chơi', value: product.level || 'Trung Bình' },
      ];
      if (product.technologies && product.technologies.length > 0) {
        specsList.push({ label: 'Công nghệ', value: product.technologies.join(', ') });
      }
      return specsList;
    } else if (product.category === 'Tennis') {
      return [
        { label: 'Thương hiệu', value: product.brand },
        { label: 'Trọng lượng (chưa căng dây)', value: '300g (10.6 oz)' },
        { label: 'Mặt vợt (Head Size)', value: '97 sq in / 625 sq cm' },
        { label: 'Độ cứng (Stiffness)', value: '62 RA' },
        { label: 'Mật độ dây', value: '16x19' },
        { label: 'Điểm cân bằng', value: '320mm / 7 pts HL' },
        { label: 'Chất liệu', value: 'Braided Graphite & Kevlar' }
      ];
    } else if (product.category === 'Pickleball') {
      return [
        { label: 'Thương hiệu', value: product.brand },
        { label: 'Trọng lượng trung bình', value: '7.9 oz' },
        { label: 'Độ dày lõi vợt', value: '16mm (Thiên về kiểm soát bóng)' },
        { label: 'Bề mặt vợt', value: 'Carbon Flex Friction Surface (Nhám tạo xoáy)' },
        { label: 'Cấu trúc lõi', value: 'Honeycomb Polypropylene Core' },
        { label: 'Chu vi tay cầm', value: '4.25 inches' },
        { label: 'Chiều dài cán vợt', value: '5.25 inches' }
      ];
    }
    return [{ label: 'Thương hiệu', value: product.brand }];
  };

  const specColumns = [
    { title: 'Thông số', dataIndex: 'label', key: 'label', width: '35%', render: text => <Text strong>{text}</Text> },
    { title: 'Chi tiết sản phẩm', dataIndex: 'value', key: 'value' }
  ];

  const renderReviewsTab = () => {
    return (
      <div style={{ padding: '16px 8px' }}>
        <Row gutter={[32, 32]}>
          {/* Reviews List */}
          <Col xs={24} md={14}>
            <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Nhận xét từ khách hàng ({totalReviews})
            </Title>
            
            {reviews.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <Text type="secondary" style={{ fontSize: '15px' }}>Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!</Text>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <Space>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#DC2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                          {(rev.fullName || rev.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Text strong style={{ display: 'block', fontSize: '14px' }}>{rev.fullName || rev.username}</Text>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </Text>
                        </div>
                      </Space>
                      <Rate disabled value={rev.rating} style={{ fontSize: '12px', color: '#FADB14' }} />
                    </div>
                    <Paragraph style={{ paddingLeft: '44px', margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
                      {rev.comment}
                    </Paragraph>
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Review Write Form */}
          <Col xs={24} md={10}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fafafa', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <Title level={4} style={{ margin: '0 0 16px 0', color: '#DC2626', fontSize: '18px', fontWeight: 700 }}>Viết đánh giá của bạn</Title>
              
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Đánh giá số sao:</Text>
                    <Rate value={userReviewRating} onChange={setUserReviewRating} style={{ color: '#FADB14', fontSize: '24px' }} />
                  </div>
                  
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Nội dung nhận xét:</Text>
                    <Input.TextArea
                      placeholder="Hãy chia sẻ cảm nhận thực tế của bạn về chất lượng sản phẩm..."
                      value={userReviewComment}
                      onChange={(e) => setUserReviewComment(e.target.value)}
                      rows={4}
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                  
                  <Button
                    type="primary"
                    size="large"
                    loading={submittingReview}
                    onClick={handleSubmitReview}
                    style={{ background: '#DC2626', borderColor: '#DC2626', fontWeight: 700, borderRadius: '8px', marginTop: '8px' }}
                  >
                    Gửi đánh giá
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    Vui lòng đăng nhập để gửi đánh giá và nhận xét về sản phẩm này.
                  </Text>
                  <Button
                    type="primary"
                    onClick={() => navigate('/login')}
                    style={{ background: '#DC2626', borderColor: '#DC2626', fontWeight: 700, borderRadius: '8px' }}
                  >
                    Đăng nhập ngay
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const tabsItems = [
    {
      key: '1',
      label: <span style={{ fontSize: '15px', fontWeight: 600 }}>Thông số kỹ thuật</span>,
      children: (
        <Table
          dataSource={getSpecs()}
          columns={specColumns}
          rowKey="label"
          pagination={false}
          size="middle"
          bordered
          style={{ marginTop: 12 }}
        />
      )
    },
    {
      key: '2',
      label: <span style={{ fontSize: '15px', fontWeight: 600 }}>Mô tả sản phẩm</span>,
      children: (
        <div style={{ marginTop: 12, padding: '0 8px' }}>
          <Paragraph style={{ fontSize: '15px', lineHeight: '1.8' }}>
            {product.description} Sản phẩm được nhập khẩu chính hãng và phân phối bởi AndrewSport. Thiết kế khí động học hiện đại tối ưu lực cản gió, mang lại độ ổn định cao trong từng pha vung vợt.
          </Paragraph>
          <Paragraph style={{ fontSize: '15px', lineHeight: '1.8' }}>
            Được kiểm nghiệm thực tế bởi các vận động viên chuyên nghiệp. Khung vợt sử dụng sợi carbon cường độ cao mang lại cảm giác đánh bóng cực êm, hỗ trợ phản tạt nhanh và kiểm soát trận đấu hoàn hảo.
          </Paragraph>
        </div>
      )
    },
    {
      key: '3',
      label: <span style={{ fontSize: '15px', fontWeight: 600 }}>Đánh giá & Bình luận ({totalReviews})</span>,
      children: renderReviewsTab()
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item><a onClick={() => navigate('/')}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item><a onClick={() => navigate(`/?category=${product.category}`)}>{product.category === 'Badminton' ? 'Cầu lông' : product.category}</a></Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        style={{ marginBottom: 16, paddingLeft: 0 }}
      >
        Quay lại danh sách sản phẩm
      </Button>

      <Row gutter={[32, 32]} style={{ marginBottom: 32 }}>
        {/* Product Images (Left) */}
        <Col xs={24} md={11}>
          <Card 
            bodyStyle={{ padding: 12 }} 
            cover={
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '100%', borderRadius: 8, height: '400px', objectFit: 'cover' }}
              />
            }
          />
        </Col>

        {/* Product Actions and Promotions (Right) */}
        <Col xs={24} md={13}>
          <div>
            <Space align="center" style={{ marginBottom: 8 }}>
              <TrophyOutlined style={{ color: '#DC2626', fontSize: '18px' }} />
              <Text style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Hãng {product.brand}
              </Text>
              <Tag color="red" style={{ borderRadius: 4 }}>{product.category === 'Badminton' ? 'Cầu lông' : product.category === 'Tennis' ? 'Quần vợt' : product.category}</Tag>
            </Space>

            <Title level={2} style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800 }}>
              {product.name}
            </Title>

            {/* Stars rating stats summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Rate disabled allowHalf value={averageRating} style={{ color: '#FADB14', fontSize: '15px' }} />
              <Text strong style={{ fontSize: '14px', color: '#1E293B' }}>{averageRating} / 5</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>({totalReviews} đánh giá)</Text>
            </div>

            <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', marginBottom: 20, border: '1px solid #fee2e2' }}>
              <Space align="baseline">
                <span style={{ fontSize: '32px', color: '#DC2626', fontWeight: 900 }}>
                  {formatVND(product.price)}
                </span>
                <Text delete type="secondary" style={{ fontSize: '16px', marginLeft: 12, color: '#94a3b8' }}>
                  {formatVND(product.price * 1.2)}
                </Text>
                <Tag color="red" style={{ marginLeft: 8, fontWeight: 700, borderRadius: 4 }}>-20% GIẢM</Tag>
              </Space>
              
              <div style={{ marginTop: 8 }}>
                {isOutOfStock ? (
                  <Tag color="error" style={{ fontWeight: 600 }}>Tạm hết hàng</Tag>
                ) : isLowStock ? (
                  <Tag color="warning" style={{ fontWeight: 600 }}>Chỉ còn {product.stockQuantity} sản phẩm!</Tag>
                ) : (
                  <Tag color="success" style={{ fontWeight: 600 }}>Còn hàng (Có sẵn tại cửa hàng)</Tag>
                )}
              </div>
            </div>

            {/* Premium Promotion Box */}
            <Card 
              styles={{ body: { padding: '14px' } }}
              style={{ border: '1px dashed #DC2626', background: '#fff5f5', borderRadius: '8px', marginBottom: 24 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#DC2626' }}>
                <GiftOutlined style={{ fontSize: '18px' }} />
                <span style={{ fontSize: '15px', fontWeight: 700 }}>QUÀ TẶNG & KHUYẾN MÃI KÈM THEO</span>
              </div>
              <Space direction="vertical" size={6} style={{ width: '100%' }}>
                <Text>🎁 Tặng bao vợt bảo vệ chuyên dụng chính hãng.</Text>
                <Text>🎁 Tặng cuốn cán vợt thể thao chống trơn trượt cực êm.</Text>
                <Text>🛠️ **Miễn phí** dịch vụ đan lưới (Đan bằng máy đan điện tử chuẩn quốc tế).</Text>
                <Text>🛡️ Bảo hành chính hãng lỗi nhà sản xuất trong vòng **60 ngày**.</Text>
              </Space>
            </Card>

            {!isOutOfStock && (
              <div style={{ marginBottom: 24 }}>
                <Space size="large">
                  <Text strong>Số lượng mua:</Text>
                  <InputNumber 
                    min={1} 
                    max={product.stockQuantity} 
                    value={quantity} 
                    onChange={setQuantity}
                    size="large"
                    style={{ width: 80 }}
                  />
                </Space>
              </div>
            )}

            <Space size="middle" style={{ width: '100%', display: 'flex' }}>
              <Button 
                type="primary" 
                danger
                size="large" 
                disabled={isOutOfStock}
                onClick={handleBuyNowClick}
                style={{ background: '#DC2626', borderColor: '#DC2626', height: '48px', padding: '0 32px', fontWeight: 700, borderRadius: '8px' }}
              >
                MUA NGAY (Giao nhanh tận nơi)
              </Button>
              <Button 
                ghost
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large" 
                disabled={isOutOfStock}
                onClick={handleAddToCartClick}
                style={{ borderColor: '#DC2626', color: '#DC2626', height: '48px', padding: '0 24px', fontWeight: 700, borderRadius: '8px' }}
              >
                Thêm vào giỏ hàng
              </Button>
            </Space>
          </div>
        </Col>
      </Row>

      {/* Tabs for Technical Specs & Detailed Description */}
      <Card style={{ borderRadius: '12px', border: '1px solid #f1f5f9' }}>
        <Tabs defaultActiveKey="1" items={tabsItems} />
      </Card>
    </div>
  );
}
