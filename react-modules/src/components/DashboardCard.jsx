// src/components/DashboardCard.jsx
import React from 'react';

// Recibe sus datos (props) desde DashboardPage.
function DashboardCard({ icon, count, label, cardClass }) {
  return (
    <div className={`card ${cardClass}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-number">{count}</div>
      <div className="card-label">{label}</div>
    </div>
  );
}

export default DashboardCard;