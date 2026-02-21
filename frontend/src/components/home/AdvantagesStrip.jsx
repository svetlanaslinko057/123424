import React from "react";
import { Truck, Shield, RefreshCw, CreditCard, Headphones, Gift } from "lucide-react";

/**
 * AdvantagesStrip - Trust & benefits section
 * BLOCK V2-14: Homepage Retail Component
 */
const advantages = [
  {
    icon: Truck,
    title: "Швидка доставка",
    subtitle: "1-2 дні по Україні",
  },
  {
    icon: Shield,
    title: "Гарантія якості",
    subtitle: "Офіційний товар",
  },
  {
    icon: RefreshCw,
    title: "Повернення 14 днів",
    subtitle: "Без питань",
  },
  {
    icon: CreditCard,
    title: "Зручна оплата",
    subtitle: "Карткою або готівкою",
  },
  {
    icon: Headphones,
    title: "Підтримка 24/7",
    subtitle: "Завжди на зв'язку",
  },
  {
    icon: Gift,
    title: "Бонуси та акції",
    subtitle: "Для постійних клієнтів",
  },
];

const AdvantagesStrip = () => {
  return (
    <div className="advantages-strip" data-testid="advantages-strip">
      <div className="advantages-strip-items">
        {advantages.map((a, i) => (
          <div key={i} className="advantage-item">
            <div className="advantage-icon">
              <a.icon size={28} />
            </div>
            <div className="advantage-text">
              <h4 className="advantage-title">{a.title}</h4>
              <p className="advantage-subtitle">{a.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvantagesStrip;
