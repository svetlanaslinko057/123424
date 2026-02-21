import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import ProductCard from '../components/ProductCard';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CatalogV2 = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filterValues, setFilterValues] = useState({ brands: [], price_range: { min: 0, max: 100000 } });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Parse filters from URL
  const filters = {
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    brand: searchParams.get('brand') || '',
    in_stock: searchParams.get('in_stock') === 'true' ? true : null,
    sort_by: searchParams.get('sort_by') || 'popular',
    page: parseInt(searchParams.get('page') || '1'),
  };

  const T = {
    uk: {
      catalog: 'Каталог',
      found: 'Знайдено товарів',
      filters: 'Фільтри',
      sortBy: 'Сортування',
      priceFrom: 'Ціна від',
      priceTo: 'Ціна до',
      brand: 'Бренд',
      inStock: 'Тільки в наявності',
      apply: 'Застосувати',
      reset: 'Скинути',
      popular: 'Популярні',
      priceAsc: 'Спочатку дешевші',
      priceDesc: 'Спочатку дорожчі',
      newest: 'Новинки',
      rating: 'За рейтингом',
      loading: 'Завантаження...',
      noProducts: 'Товарів не знайдено',
      page: 'Сторінка'
    },
    ru: {
      catalog: 'Каталог',
      found: 'Найдено товаров',
      filters: 'Фильтры',
      sortBy: 'Сортировка',
      priceFrom: 'Цена от',
      priceTo: 'Цена до',
      brand: 'Бренд',
      inStock: 'Только в наличии',
      apply: 'Применить',
      reset: 'Сбросить',
      popular: 'Популярные',
      priceAsc: 'Сначала дешевле',
      priceDesc: 'Сначала дороже',
      newest: 'Новинки',
      rating: 'По рейтингу',
      loading: 'Загрузка...',
      noProducts: 'Товаров не найдено',
      page: 'Страница'
    }
  };

  const txt = T[language] || T.uk;

  const sortOptions = [
    { value: 'popular', label: txt.popular },
    { value: 'price_asc', label: txt.priceAsc },
    { value: 'price_desc', label: txt.priceDesc },
    { value: 'new', label: txt.newest },
    { value: 'rating', label: txt.rating },
  ];

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        limit: 24
      };
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_URL}/api/v2/catalog`, { params });
      setProducts(response.data.products || []);
      setTotal(response.data.total || 0);
      setPages(response.data.pages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch filter values
  const fetchFilterValues = useCallback(async () => {
    try {
      const params = filters.category ? { category: filters.category } : {};
      const response = await axios.get(`${API_URL}/api/v2/catalog/filters`, { params });
      setFilterValues(response.data);
    } catch (error) {
      console.error('Failed to fetch filter values:', error);
    }
  }, [filters.category]);

  useEffect(() => {
    fetchProducts();
    fetchFilterValues();
  }, [searchParams]);

  // Update URL params
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters, page: 1 }).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const setPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params);
  };

  // Active filters chips
  const activeFilters = [];
  if (filters.min_price) activeFilters.push({ key: 'min_price', label: `${txt.priceFrom}: ${filters.min_price} ₴` });
  if (filters.max_price) activeFilters.push({ key: 'max_price', label: `${txt.priceTo}: ${filters.max_price} ₴` });
  if (filters.brand) activeFilters.push({ key: 'brand', label: `${txt.brand}: ${filters.brand}` });
  if (filters.in_stock) activeFilters.push({ key: 'in_stock', label: txt.inStock });

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="container-main px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">{txt.catalog}</h1>
            <p className="text-gray-500 mt-1">{txt.found}: {total.toLocaleString()}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {txt.filters}
            </Button>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort_by}
                onChange={(e) => updateFilters({ sort_by: e.target.value })}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="hidden md:flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <button
                key={f.key}
                onClick={() => removeFilter(f.key)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors"
              >
                {f.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              {txt.reset}
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <Card className="p-6 sticky top-24 bg-white/80 backdrop-blur border-0 shadow-lg">
              <h3 className="font-bold text-lg mb-4">{txt.filters}</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{txt.priceFrom}</label>
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => updateFilters({ min_price: e.target.value })}
                  placeholder={String(filterValues.price_range?.min || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{txt.priceTo}</label>
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => updateFilters({ max_price: e.target.value })}
                  placeholder={String(filterValues.price_range?.max || 100000)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              {/* Brand */}
              {filterValues.brands?.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{txt.brand}</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => updateFilters({ brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="">Всі</option>
                    {filterValues.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.in_stock === true}
                    onChange={(e) => updateFilters({ in_stock: e.target.checked ? true : null })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold">{txt.inStock}</span>
                </label>
              </div>

              <Button 
                onClick={resetFilters}
                variant="outline"
                className="w-full"
              >
                {txt.reset}
              </Button>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center bg-white/80 backdrop-blur">
                <p className="text-xl text-gray-500">{txt.noProducts}</p>
              </Card>
            ) : (
              <>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: Math.min(pages, 10) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            pageNum === filters.page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pages > 10 && (
                      <>
                        <span className="text-gray-400">...</span>
                        <button
                          onClick={() => setPage(pages)}
                          className={`w-10 h-10 rounded-xl font-bold bg-white border border-gray-200 hover:border-blue-300`}
                        >
                          {pages}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogV2;
