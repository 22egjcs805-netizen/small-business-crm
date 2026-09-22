import React, { useState } from "react";

function Sidebar({ activePage, setActivePage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Customers", icon: "👥" },
    { name: "Leads", icon: "🎯" },
    { name: "Sales", icon: "💰" },
    { name: "Follow-Ups", icon: "📅" },
    { name: "Reports", icon: "📈" },
    { name: "Employees", icon: "🧑‍💼" },
    { name: "Settings", icon: "⚙️" },
  ];

  const handleSelect = (name) => {
    setActivePage(name);
    setMobileOpen(false); // Auto-close drawer on mobile
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="mobile-header">
        <div className="mobile-brand">
          <span className="mobile-logo-icon">🏢</span>
          <span className="mobile-brand-title">Apex CRM</span>
        </div>
        <button
          className="hamburger-btn"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <h2>Apex CRM</h2>
          <p>Small Business Hub</p>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={
                activePage === item.name ||
                (item.name === "Follow-Ups" && activePage === "FollowUps")
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => handleSelect(item.name)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;