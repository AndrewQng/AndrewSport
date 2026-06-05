import React from 'react';
import useProducts from '../hooks/useProducts';
import LandingView from '../components/home/LandingView';
import CatalogView from '../components/home/CatalogView';

export default function Home({ onAddToCart }) {
  const productState = useProducts();

  const isLandingMode = !productState.selectedCategory && !productState.searchQuery;

  if (isLandingMode) {
    return (
      <LandingView
        products={productState.products}
        onAddToCart={onAddToCart}
        activeNewTab={productState.activeNewTab}
        setActiveNewTab={productState.setActiveNewTab}
        getTabProducts={productState.getTabProducts}
        setSearchParams={productState.setSearchParams}
      />
    );
  }

  return (
    <CatalogView
      {...productState}
      onAddToCart={onAddToCart}
    />
  );
}
