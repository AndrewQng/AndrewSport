import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { message } from 'antd';
import { technologies } from '../constants/productFilters';

export default function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const selectedSubCategory = searchParams.get('subCategory') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('none');
  const [activeNewTab, setActiveNewTab] = useState('Tất cả');

  // Accordion filters state
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedLengths, setSelectedLengths] = useState([]);
  const [selectedGrips, setSelectedGrips] = useState([]);
  const [selectedSwings, setSelectedSwings] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [selectedBalances, setSelectedBalances] = useState([]);
  const [selectedStiffnesses, setSelectedStiffnesses] = useState([]);
  const [selectedPlayStyles, setSelectedPlayStyles] = useState([]);
  const [selectedGameModes, setSelectedGameModes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [techSearch, setTechSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Sync selectedBrand with filters
  useEffect(() => {
    if (selectedBrand) {
      setSelectedBrands([selectedBrand]);
    } else {
      setSelectedBrands([]);
    }
  }, [selectedBrand]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/products', { params });
      setProducts(response.data.filter(p => p.status === 'ACTIVE'));
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if a product matches filters (Client-side matching)
  const matchesAccordionFilters = (product) => {
    const name = product.name.toLowerCase();
    const brand = product.brand;
    const price = product.price;

    // Subcategory matching (from Navbar/home cards)
    if (selectedSubCategory) {
      if (selectedSubCategory === 'vợt' && (!name.includes('vợt') || name.includes('túi') || name.includes('balo') || name.includes('bao vợt') || name.includes('cước') || name.includes('quấn cán'))) return false;
      if (selectedSubCategory === 'giày' && !name.includes('giày')) return false;
      if (selectedSubCategory === 'áo' && !name.includes('áo')) return false;
      if (selectedSubCategory === 'váy' && !name.includes('váy')) return false;
      if (selectedSubCategory === 'quần' && !name.includes('quần')) return false;
      if (selectedSubCategory === 'váy_quần' && !name.includes('váy') && !name.includes('quần')) return false;
      if (selectedSubCategory === 'túi' && !name.includes('túi')) return false;
      if (selectedSubCategory === 'balo' && !name.includes('balo')) return false;
      if (selectedSubCategory === 'phụ kiện' && !name.includes('phụ kiện') && !name.includes('cước') && !name.includes('quả cầu')) return false;
    }

    // 1. Price
    if (selectedPrices.length > 0) {
      const priceMatches = selectedPrices.some(range => {
        if (range === 'under500') return price < 500000;
        if (range === '500to1M') return price >= 500000 && price <= 1000000;
        if (range === '1to2M') return price >= 1000000 && price <= 2000000;
        if (range === '2to3M') return price >= 2000000 && price <= 3000000;
        if (range === 'over3M') return price > 3000000;
        return false;
      });
      if (!priceMatches) return false;
    }

    // 2. Brand
    if (selectedBrands.length > 0) {
      if (!selectedBrands.some(b => brand.toLowerCase() === b.toLowerCase())) return false;
    }

    // 3. Length
    if (selectedLengths.length > 0) {
      const len = product.length || (brand === 'Yonex' ? '675' : '670');
      if (!selectedLengths.some(l => len === l)) return false;
    }

    // 4. Grip Length
    if (selectedGrips.length > 0) {
      const grip = product.gripLength || (name.includes('astrox') ? '205' : name.includes('voltric') ? '200' : '210');
      if (!selectedGrips.some(g => grip === g)) return false;
    }

    // 5. Swingweight
    if (selectedSwings.length > 0) {
      const swing = product.swingweight || (name.includes('astrox 99') || name.includes('z force') ? 'above88' : '84-86');
      if (!selectedSwings.some(s => swing === s)) return false;
    }

    // 6. Weight
    if (selectedWeights.length > 0) {
      const w = product.weight || (name.includes('training') ? '2U' : '4U');
      if (!selectedWeights.some(wt => w === wt)) return false;
    }

    // 7. Balance
    if (selectedBalances.length > 0) {
      const bal = product.balance || 'Cân Bằng';
      if (!selectedBalances.some(b => bal === b)) return false;
    }

    // 8. Stiffness
    if (selectedStiffnesses.length > 0) {
      const stiff = product.stiffness || 'Trung Bình';
      if (!selectedStiffnesses.some(s => stiff === s)) return false;
    }

    // 9. Play Style
    if (selectedPlayStyles.length > 0) {
      const style = product.playStyle || 'Công Thủ Toàn Diện';
      if (!selectedPlayStyles.some(s => style === s)) return false;
    }

    // 10. Game Mode
    if (selectedGameModes.length > 0) {
      const mode = product.gameMode || 'Cả Đơn và Đôi';
      if (!selectedGameModes.some(m => mode === m)) return false;
    }

    // 11. Level
    if (selectedLevels.length > 0) {
      const lvl = product.level || 'Trung Bình';
      if (!selectedLevels.some(l => lvl === l)) return false;
    }

    // 12. Techs
    if (selectedTechs.length > 0) {
      const productTechs = product.technologies || [];
      const hasTech = selectedTechs.some(t => {
        if (productTechs.includes(t)) return true;
        if (t === 'NAMD' && name.includes('astrox')) return true;
        if (t === 'ISOMETRIC' && brand === 'Yonex') return true;
        if (t === 'ROTATIONAL GENARATOR SYSTEM' && name.includes('astrox')) return true;
        return false;
      });
      if (!hasTech) return false;
    }

    return true;
  };

  const displayedProducts = products.filter(matchesAccordionFilters);

  const sortedProducts = [...displayedProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  const getTabProducts = () => {
    return products.filter(p => {
      const name = p.name.toLowerCase();
      if (activeNewTab === 'Tất cả') return true;
      if (activeNewTab === 'Vợt Cầu Lông') return name.includes('vợt') && p.category === 'Badminton';
      if (activeNewTab === 'Giày Cầu Lông') return name.includes('giày') && p.category === 'Badminton';
      if (activeNewTab === 'Áo Cầu Lông') return name.includes('áo') && p.category === 'Badminton';
      if (activeNewTab === 'Váy cầu lông') return name.includes('váy') && p.category === 'Badminton';
      if (activeNewTab === 'Quần Cầu Lông') return name.includes('quần') && p.category === 'Badminton';
      return true;
    });
  };

  const filteredTechs = technologies.filter(t => t.toLowerCase().includes(techSearch.toLowerCase()));

  return {
    products,
    displayedProducts,
    sortedProducts,
    loading,
    sortBy,
    setSortBy,
    activeNewTab,
    setActiveNewTab,
    techSearch,
    setTechSearch,
    
    // Filter states
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

    // URL search params
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedSubCategory,
    setSearchParams,

    // Helpers
    fetchProducts,
    getTabProducts,
    filteredTechs,
  };
}
