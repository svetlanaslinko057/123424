import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, Heart, GitCompare, User, Phone, X } from "lucide-react";
import MegaMenu from "./MegaMenu";
import { MiniCart } from "../cart";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useComparison } from "../../contexts/ComparisonContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "";

/**
 * HeaderV3 - Retail-style двухстрочный header
 * BLOCK V2-12R: Возвращаем retail visual + новая архитектура
 */
export default function HeaderV3() {
  const [showMega, setShowMega] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const megaRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const { comparisonItems } = useComparison();

  // Live search suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v2/search/suggest`, {
          params: { q: query, limit: 6 }
        });
        setSuggestions(res.data.items || []);
        setShowSuggestions(true);
      } catch (err) {
        // Fallback to products search
        try {
          const res = await axios.get(`${API_URL}/api/products`, {
            params: { search: query, limit: 6 }
          });
          setSuggestions(res.data?.slice?.(0, 6) || []);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setShowSuggestions(false);
    setQuery("");
  };

  const favoritesCount = favorites?.length || 0;
  const comparisonCount = comparisonItems?.length || 0;

  return (
    <header className="v3-header" data-testid="header-v3">
      {/* Top line */}
      <div className="v3-top">
        <div className="container v3-top-inner">
          {/* Logo */}
          <Link to="/" className="v3-logo" data-testid="logo">
            <span className="v3-logo-text">Y-Store</span>
          </Link>

          {/* Search */}
          <div className="v3-search" ref={searchRef}>
            <form onSubmit={handleSearch} className="v3-search-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="Пошук товарів..."
                className="v3-search-input"
                data-testid="search-input"
              />
              <button type="submit" className="v3-search-btn" data-testid="search-btn">
                <Search size={20} />
              </button>
            </form>

            {/* Search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="v3-search-suggestions" data-testid="search-suggestions">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="v3-suggestion-item"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt="" className="v3-suggestion-img" />
                    )}
                    <div className="v3-suggestion-info">
                      <div className="v3-suggestion-title">{product.title || product.name}</div>
                      <div className="v3-suggestion-price">{product.price?.toLocaleString()} ₴</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts */}
          <div className="v3-contacts">
            <a href="tel:+380502474161" className="v3-phone">
              <Phone size={14} />
              <span>050-247-41-61</span>
            </a>
            <a href="tel:+380637247703" className="v3-phone">
              <Phone size={14} />
              <span>063-724-77-03</span>
            </a>
          </div>

          {/* Icons */}
          <div className="v3-icons">
            <Link 
              to="/wishlist" 
              className="v3-icon-link" 
              title="Обране"
              data-testid="wishlist-link"
            >
              <Heart size={22} />
              {favoritesCount > 0 && <span className="v3-badge">{favoritesCount}</span>}
            </Link>
            <Link 
              to="/comparison" 
              className="v3-icon-link" 
              title="Порівняння"
              data-testid="compare-link"
            >
              <GitCompare size={22} />
              {comparisonCount > 0 && <span className="v3-badge">{comparisonCount}</span>}
            </Link>
            
            {/* Mini Cart */}
            <MiniCart />
            
            <Link 
              to={isAuthenticated ? "/account" : "/login"} 
              className="v3-icon-link v3-user-link"
              title={isAuthenticated ? "Кабінет" : "Увійти"}
              data-testid="account-link"
            >
              <User size={22} />
              {isAuthenticated && user?.full_name && (
                <span className="v3-user-name">{user.full_name.split(" ")[0]}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="v3-bottom">
        <div className="container v3-bottom-inner">
          {/* Catalog button with MegaMenu */}
          <div
            className="v3-catalog-btn"
            ref={megaRef}
            onMouseEnter={() => setShowMega(true)}
            onMouseLeave={() => setShowMega(false)}
            data-testid="catalog-btn"
          >
            <Menu size={18} />
            <span>Каталог</span>
            
            {showMega && (
              <div className="v3-mega-wrapper">
                <MegaMenu onClose={() => setShowMega(false)} />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="v3-nav">
            <Link to="/contact" className="v3-nav-link">Контакти</Link>
            <Link to="/delivery-payment" className="v3-nav-link">Доставка і оплата</Link>
            <Link to="/exchange-return" className="v3-nav-link">Обмін і повернення</Link>
            <Link to="/about" className="v3-nav-link">Про нас</Link>
            <Link to="/promotions" className="v3-nav-link v3-nav-promo">Акції</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
