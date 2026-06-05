import React, { useState } from 'react';
import { Row, Col, Select, Typography, Space, Spin, Empty, Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import ProductCard from '../ProductCard';
import FilterSidebar from './FilterSidebar';

const { Text } = Typography;
const { Option } = Select;

export default function CatalogView({
  sortedProducts,
  loading,
  sortBy,
  setSortBy,
  onAddToCart,
  
  // Filter Props passed down to FilterSidebar
  selectedCategory,
  selectedSubCategory,
  selectedPrices,
  setSelectedPrices,
  selectedBrands,
  setSelectedBrands,
  selectedLengths,
  setSelectedLengths,
  selectedGrips,
  setSelectedGrips,
  selectedSwings,
  setSelectedSwings,
  selectedWeights,
  setSelectedWeights,
  selectedBalances,
  setSelectedBalances,
  selectedStiffnesses,
  setSelectedStiffnesses,
  selectedPlayStyles,
  setSelectedPlayStyles,
  selectedGameModes,
  setSelectedGameModes,
  selectedLevels,
  setSelectedLevels,
  selectedTechs,
  setSelectedTechs,
  techSearch,
  setTechSearch,
  filteredTechs,
}) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const filterSidebarElement = (
    <FilterSidebar
      selectedCategory={selectedCategory}
      selectedSubCategory={selectedSubCategory}
      selectedPrices={selectedPrices}
      setSelectedPrices={setSelectedPrices}
      selectedBrands={selectedBrands}
      setSelectedBrands={setSelectedBrands}
      selectedLengths={selectedLengths}
      setSelectedLengths={setSelectedLengths}
      selectedGrips={selectedGrips}
      setSelectedGrips={setSelectedGrips}
      selectedSwings={selectedSwings}
      setSelectedSwings={setSelectedSwings}
      selectedWeights={selectedWeights}
      setSelectedWeights={setSelectedWeights}
      selectedBalances={selectedBalances}
      setSelectedBalances={setSelectedBalances}
      selectedStiffnesses={selectedStiffnesses}
      setSelectedStiffnesses={setSelectedStiffnesses}
      selectedPlayStyles={selectedPlayStyles}
      setSelectedPlayStyles={setSelectedPlayStyles}
      selectedGameModes={selectedGameModes}
      setSelectedGameModes={setSelectedGameModes}
      selectedLevels={selectedLevels}
      setSelectedLevels={setSelectedLevels}
      selectedTechs={selectedTechs}
      setSelectedTechs={setSelectedTechs}
      techSearch={techSearch}
      setTechSearch={setTechSearch}
      filteredTechs={filteredTechs}
    />
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Floating filter trigger on Mobile */}
      <Button 
        type="primary" 
        icon={<FilterOutlined />} 
        onClick={() => setFilterDrawerOpen(true)}
        className="show-on-mobile-flex"
        style={{ marginBottom: 16, background: '#DC2626', borderColor: '#DC2626', fontWeight: 600, gap: 6 }}
      >
        Bộ lọc sản phẩm
      </Button>

      <Row gutter={[24, 24]}>
        {/* Left Column: Desktop FilterSidebar */}
        <Col xs={0} md={6} className="hide-on-mobile">
          {filterSidebarElement}
        </Col>

        {/* Right Column: Matched Products Listing */}
        <Col xs={24} md={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: '12px' }}>
            <Text type="secondary" style={{ fontSize: '15px' }}>
              Tìm thấy <Text strong style={{ color: '#DC2626' }}>{sortedProducts.length}</Text> sản phẩm phù hợp
            </Text>
            
            <Space>
              <Text>Sắp xếp theo:</Text>
              <Select value={sortBy} style={{ width: 180 }} onChange={setSortBy}>
                <Option value="none">Nổi bật</Option>
                <Option value="priceAsc">Giá: Thấp đến Cao</Option>
                <Option value="priceDesc">Giá: Cao đến Thấp</Option>
              </Select>
            </Space>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
              <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ padding: '60px 0' }}>
              <Empty description="Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm." />
            </div>
          ) : (
            <Row gutter={{ xs: 10, sm: 16, md: 20, lg: 20 }}>
              {sortedProducts.map((product) => (
                <Col xs={12} sm={12} lg={8} key={product.id}>
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Drawer filter on Mobile */}
      <Drawer
        title={<span style={{ fontWeight: 800, color: '#DC2626' }}>BỘ LỌC TÌM KIẾM</span>}
        placement="left"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={300}
      >
        {filterSidebarElement}
      </Drawer>
    </div>
  );
}
