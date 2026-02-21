import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * BrandsStrip - Popular brands showcase
 * BLOCK V2-14: Homepage Retail Component
 */
const brands = [
  { name: "Apple", logo: "🍎" },
  { name: "Samsung", logo: "📱" },
  { name: "Sony", logo: "🎮" },
  { name: "LG", logo: "📺" },
  { name: "Xiaomi", logo: "📲" },
  { name: "HP", logo: "💻" },
  { name: "Lenovo", logo: "🖥️" },
  { name: "ASUS", logo: "⌨️" },
  { name: "Dell", logo: "🖱️" },
  { name: "Huawei", logo: "📡" },
];

const BrandsStrip = () => {
  const navigate = useNavigate();

  return (
    <div className="brands-strip" data-testid="brands-strip">
      <h2 className="section-title">Популярні бренди</h2>
      
      <div className="brands-strip-items">
        {brands.map((b, i) => (
          <div
            key={i}
            className="brand-item"
            onClick={() => navigate(`/catalog?brand=${b.name.toLowerCase()}`)}
            data-testid={`brand-${b.name.toLowerCase()}`}
          >
            <span className="brand-logo">{b.logo}</span>
            <span className="brand-name">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsStrip;
