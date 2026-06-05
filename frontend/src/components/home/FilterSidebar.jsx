import React from 'react';
import { Collapse, Checkbox, Input, Typography } from 'antd';
import { CompassOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function FilterSidebar({
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
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626' }}>
        <CompassOutlined /> Bộ lọc tìm kiếm
      </Title>

      <Collapse 
        ghost 
        defaultActiveKey={['price', 'brand']}
        style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '12px' }}
      >
        {/* 1. Chọn mức giá */}
        <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Chọn mức giá</span>} key="price">
          <Checkbox.Group 
            value={selectedPrices} 
            onChange={setSelectedPrices} 
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <Checkbox value="under500">Giá dưới 500.000đ</Checkbox>
            <Checkbox value="500to1M">500.000đ - 1 triệu</Checkbox>
            <Checkbox value="1to2M">1 - 2 triệu</Checkbox>
            <Checkbox value="2to3M">2 - 3 triệu</Checkbox>
            <Checkbox value="over3M">Giá trên 3 triệu</Checkbox>
          </Checkbox.Group>
        </Collapse.Panel>

        {/* 2. Thương hiệu */}
        <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Thương hiệu</span>} key="brand">
          <Checkbox.Group 
            value={selectedBrands} 
            onChange={setSelectedBrands} 
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <Checkbox value="Yonex">Yonex</Checkbox>
            <Checkbox value="Lining">Lining</Checkbox>
            <Checkbox value="Victor">Victor</Checkbox>
            <Checkbox value="VS">VS</Checkbox>
            <Checkbox value="Mizuno">Mizuno</Checkbox>
            <Checkbox value="Apacs">Apacs</Checkbox>
          </Checkbox.Group>
        </Collapse.Panel>

        {/* Badminton Racket Specific Filters */}
        {(selectedCategory === 'Badminton' || selectedSubCategory === 'vợt') && (
          <>
            {/* 3. Chiều dài vợt */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Chiều dài vợt</span>} key="length">
              <Checkbox.Group 
                value={selectedLengths} 
                onChange={setSelectedLengths} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="665">665 mm</Checkbox>
                <Checkbox value="670">670 mm</Checkbox>
                <Checkbox value="675">675 mm</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 4. Chiều dài cán vợt */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Chiều dài cán vợt</span>} key="grip">
              <Checkbox.Group 
                value={selectedGrips} 
                onChange={setSelectedGrips} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="200">200 mm</Checkbox>
                <Checkbox value="205">205 mm</Checkbox>
                <Checkbox value="210">210 mm</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 5. Swingweight */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Swingweight</span>} key="swing">
              <Checkbox.Group 
                value={selectedSwings} 
                onChange={setSelectedSwings} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="under82">Dưới 82 kg/cm2</Checkbox>
                <Checkbox value="82-84">82-84 kg/cm2</Checkbox>
                <Checkbox value="84-86">84-86 kg/cm2</Checkbox>
                <Checkbox value="86-88">86-88 kg/cm2</Checkbox>
                <Checkbox value="above88">Trên 88 kg/cm2</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 6. Trọng Lượng */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Trọng Lượng</span>} key="weight">
              <Checkbox.Group 
                value={selectedWeights} 
                onChange={setSelectedWeights} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="2U">2U: 90 - 94g</Checkbox>
                <Checkbox value="3U">3U: 85 - 89g</Checkbox>
                <Checkbox value="4U">4U: 80 - 84g</Checkbox>
                <Checkbox value="5U">5U: 75 - 79g</Checkbox>
                <Checkbox value="F">F: 70 - 74g</Checkbox>
                <Checkbox value="2F">2F: 65 - 69g</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 7. Điểm Cân Bằng */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Điểm Cân Bằng</span>} key="balance">
              <Checkbox.Group 
                value={selectedBalances} 
                onChange={setSelectedBalances} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="Nhẹ Đầu">Nhẹ Đầu</Checkbox>
                <Checkbox value="Cân Bằng">Cân Bằng</Checkbox>
                <Checkbox value="Hơi Nặng Đầu">Hơi Nặng Đầu</Checkbox>
                <Checkbox value="Nặng Đầu">Nặng Đầu</Checkbox>
                <Checkbox value="Siêu Nặng Đầu">Siêu Nặng Đầu</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 8. Độ Cứng Đũa */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Độ Cứng Đũa</span>} key="stiffness">
              <Checkbox.Group 
                value={selectedStiffnesses} 
                onChange={setSelectedStiffnesses} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="Dẻo">Dẻo</Checkbox>
                <Checkbox value="Trung Bình">Trung Bình</Checkbox>
                <Checkbox value="Cứng">Cứng</Checkbox>
                <Checkbox value="Siêu Cứng">Siêu Cứng</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 9. Phong Cách Chơi */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Phong Cách Chơi</span>} key="playStyle">
              <Checkbox.Group 
                value={selectedPlayStyles} 
                onChange={setSelectedPlayStyles} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="Tấn Công">Tấn Công</Checkbox>
                <Checkbox value="Công Thủ Toàn Diện">Công Thủ Toàn Diện</Checkbox>
                <Checkbox value="Phản Tạt, Phòng Thủ">Phản Tạt, Phòng Thủ</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 10. Nội Dung Chơi */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Nội Dung Chơi</span>} key="gameMode">
              <Checkbox.Group 
                value={selectedGameModes} 
                onChange={setSelectedGameModes} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="Đánh Đơn">Đánh Đơn</Checkbox>
                <Checkbox value="Đánh Đôi">Đánh Đôi</Checkbox>
                <Checkbox value="Cả Đơn và Đôi">Cả Đơn và Đôi</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 11. Trình Độ Chơi */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Trình Độ Chơi</span>} key="level">
              <Checkbox.Group 
                value={selectedLevels} 
                onChange={setSelectedLevels} 
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Checkbox value="Mới Chơi">Mới Chơi</Checkbox>
                <Checkbox value="Trung Bình">Trung Bình</Checkbox>
                <Checkbox value="Khá Tốt">Khá Tốt</Checkbox>
              </Checkbox.Group>
            </Collapse.Panel>

            {/* 12. Công nghệ */}
            <Collapse.Panel header={<span style={{ fontWeight: 700 }}>Công nghệ</span>} key="tech">
              <Input 
                placeholder="Tìm công nghệ" 
                value={techSearch}
                onChange={e => setTechSearch(e.target.value)}
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ marginBottom: 12, borderRadius: 6 }}
              />
              <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '2px' }} className="tech-scrollbar">
                <Checkbox.Group 
                  value={selectedTechs} 
                  onChange={setSelectedTechs} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {filteredTechs.map((tech, index) => (
                    <Checkbox value={tech} key={index}>{tech}</Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
            </Collapse.Panel>
          </>
        )}
      </Collapse>
    </div>
  );
}
