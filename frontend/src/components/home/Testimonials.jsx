import React from "react";
import { Star, Quote } from "lucide-react";

/**
 * Testimonials - Customer reviews section
 * BLOCK V2-14: Homepage Retail Component
 */
const testimonials = [
  {
    name: "Олександр К.",
    rating: 5,
    text: "Замовляв iPhone, все прийшло вчасно і в ідеальному стані. Рекомендую!",
    date: "2 дні тому",
    product: "iPhone 15 Pro",
  },
  {
    name: "Марина В.",
    rating: 5,
    text: "Відмінний магазин! Консультанти допомогли з вибором ноутбука. Дуже задоволена покупкою.",
    date: "Тиждень тому",
    product: "MacBook Air M3",
  },
  {
    name: "Дмитро С.",
    rating: 5,
    text: "Швидка доставка, якісний товар, приємні ціни. Буду замовляти ще!",
    date: "2 тижні тому",
    product: "Samsung Galaxy S24",
  },
];

const Testimonials = () => {
  return (
    <div className="testimonials-section" data-testid="testimonials">
      <h2 className="section-title">Відгуки покупців</h2>
      
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                {t.name.charAt(0)}
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">{t.name}</h4>
                <div className="testimonial-rating">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="#FFD700" color="#FFD700" />
                  ))}
                </div>
              </div>
              <Quote size={24} className="testimonial-quote" />
            </div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-footer">
              <span className="testimonial-product">{t.product}</span>
              <span className="testimonial-date">{t.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
