# 📦 InvenTI System (Case Study)

> **🔒 Confidentiality Notice:** The source code of this application is private and proprietary. This repository documents only the architecture, case study, and functional modules of the system.

---

## 🎯 Overview
**InvenTI System** is a Full Stack web solution designed for centralized real-time control, management, and auditing of inventory and technical assets. It was built to replace manual, outdated spreadsheet tracking, resolving bottlenecks in supply registration, stock loss, and lack of traceability.

---

## 💻 System Interface & Modules

### 1. Control Panel & Inventory Metrics
Interactive overview consolidating critical metrics in real time: total SKUs, stock health status (Normal, Low, Critical), category distribution, and recent activity logs.

![Dashboard Overview](dashboard-overview.png)

---

### 2. Movements Kardex & Traceability
Specialized module for auditing Inbound, Outbound, and Inter-warehouse Transfers. Ensures precise control over quantities, stock balances, responsible users, and order references.

![Kardex Movements](kardex-movements.png)

---

## 🛠️ Tech Stack
<p align="left">
  <img src="https://skillicons.dev/icons?i=js,nodejs,express,react,mysql" alt="Tech Stack" />
</p>

- **Backend:** Node.js, Express (RESTful API)
- **Frontend:** React.js, HTML5, CSS3 (Responsive and modular design)
- **Database:** MySQL
- **Version Control:** Git / GitHub

---

## 🚀 Key Modules & Features

### 1. Dashboard & Metrics
- Consolidated real-time metrics: Total SKUs, stock levels, and low-stock alerts.
- Inventory health monitor and activity log.

### 2. Asset & Inventory Management
- Detailed registration of products, categories, statuses, and locations.
- Inbound and outbound stock control with instant balance updates.

### 3. Audit Log
- Operational traceability for internal tracking of data modifications.

---

## 🏗️ Architecture
The system operates under a client-server architecture connected via a RESTful API:
1. **Client (React):** SPA interface optimized for smooth navigation and real-time interaction.
2. **Server (Express):** Data validation, business logic processing, and request management.
3. **Persistence (MySQL):** Normalized relational data modeling to guarantee data integrity.

---

## 📩 Contact & Demos
For architecture inquiries or to request a private demonstration of the functional system, you can write to **inventiwebcr@gmail.com**.

