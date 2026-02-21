import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Smartphone, Laptop, Tv, Headphones, Home, Camera, Watch, Gamepad2, ChevronRight } from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Default categories with icons
const DEFAULT_CATEGORIES = [
  { name: { uk: "Смартфони", ru: "Смартфоны" }, slug: "smartphones", icon: Smartphone },
  { name: { uk: "Ноутбуки", ru: "Ноутбуки" }, slug: "laptops", icon: Laptop },
  { name: { uk: "Телевізори", ru: "Телевизоры" }, slug: "tv", icon: Tv },
  { name: { uk: "Навушники", ru: "Наушники" }, slug: "audio", icon: Headphones },
  { name: { uk: "Побутова техніка", ru: "Бытовая техника" }, slug: "home", icon: Home },
  { name: { uk: "Фото та відео", ru: "Фото и видео" }, slug: "photo", icon: Camera },
  { name: { uk: "Розумні годинники", ru: "Умные часы" }, slug: "wearables", icon: Watch },
  { name: { uk: "Ігри та приставки", ru: "Игры и приставки" }, slug: "gaming", icon: Gamepad2 },
];

/**
 * MegaMenu Component
 * BLOCK V2-12 - Категории с иконками и подкатегориями
 */
export default function MegaMenu({ lang = "uk", onClose }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const r = await axios.get(`${API_URL}/api/v2/categories/tree`);
        const tree = r.data?.tree || r.data || [];
        if (tree.length > 0) {
          // Map API categories to our format
          const mapped = tree.slice(0, 8).map((cat, idx) => ({
            id: cat.id,
            name: cat.name || { uk: cat.title, ru: cat.title },
            slug: cat.slug || cat.id,
            icon: DEFAULT_CATEGORIES[idx]?.icon || Smartphone,
            children: cat.children || [],
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  const getName = (cat) => {
    if (typeof cat.name === "object") {
      return cat.name[lang] || cat.name.uk || cat.name.ru || "";
    }
    return cat.name || "";
  };

  return (
    <div 
      className="v2-mega" 
      onMouseLeave={onClose}
      data-testid="mega-menu"
    >
      <div className="v2-mega-main">
        {categories.map((cat) => {
          const Icon = cat.icon || Smartphone;
          return (
            <div
              key={cat.slug || cat.id}
              className={`v2-mega-item ${hoveredCategory === cat.slug ? "active" : ""}`}
              onMouseEnter={() => setHoveredCategory(cat.slug)}
            >
              <Link
                to={`/catalog?category=${cat.slug || cat.id}`}
                onClick={onClose}
                className="v2-mega-link"
              >
                <Icon size={20} />
                <span>{getName(cat)}</span>
                {cat.children?.length > 0 && <ChevronRight size={16} className="v2-mega-arrow" />}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Subcategories panel */}
      {hoveredCategory && (
        <div className="v2-mega-sub">
          {categories
            .find((c) => c.slug === hoveredCategory)
            ?.children?.map((sub) => (
              <Link
                key={sub.id || sub.slug}
                to={`/catalog?category=${sub.slug || sub.id}`}
                onClick={onClose}
                className="v2-mega-sublink"
              >
                {sub.name || sub.title}
              </Link>
            ))}
        </div>
      )}

      {/* Promo banner */}
      <div className="v2-mega-promo">
        <div className="v2-mega-promo-content">
          <div className="v2-mega-promo-title">
            {lang === "uk" ? "Знижки до -30%" : "Скидки до -30%"}
          </div>
          <div className="v2-mega-promo-text">
            {lang === "uk" ? "На популярні товари" : "На популярные товары"}
          </div>
          <Link to="/catalog?sort=discount" onClick={onClose} className="v2-mega-promo-btn">
            {lang === "uk" ? "Переглянути" : "Посмотреть"}
          </Link>
        </div>
      </div>
    </div>
  );
}
