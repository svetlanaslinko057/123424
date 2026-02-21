import React, { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";

/**
 * Deal of Day - Countdown timer with urgency
 * BLOCK V2-14: Homepage Retail Component
 */
const DealOfDay = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Calculate time until midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const initialTime = Math.floor((midnight - now) / 1000);
    setTimeLeft(initialTime > 0 ? initialTime : 86400);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="deal-of-day" data-testid="deal-of-day">
      <div className="deal-of-day-content">
        <div className="deal-of-day-left">
          <div className="deal-of-day-badge">
            <Zap size={16} />
            <span>Акція дня</span>
          </div>
          <h2 className="deal-of-day-title">Спеціальні ціни тільки сьогодні</h2>
          <p className="deal-of-day-subtitle">Встигніть придбати товари зі знижкою до 50%</p>
        </div>
        
        <div className="deal-of-day-timer">
          <Clock size={20} />
          <div className="timer-blocks">
            <div className="timer-block">
              <span className="timer-value">{pad(hours)}</span>
              <span className="timer-label">год</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-block">
              <span className="timer-value">{pad(minutes)}</span>
              <span className="timer-label">хв</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-block">
              <span className="timer-value">{pad(seconds)}</span>
              <span className="timer-label">сек</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealOfDay;
