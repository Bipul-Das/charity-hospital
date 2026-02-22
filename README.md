# 🏥 Charity Hospital Management System (CHMS)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

An enterprise-grade Hospital Management System designed to streamline clinical, administrative, and pharmaceutical workflows for healthcare institutions. Built entirely on the **MERN Stack**, this system enforces strict Role-Based Access Control (RBAC) and features a modern, high-performance UI tailored for medical professionals.

---

## ✨ Key Features by Module

### 🔐 Smart Authentication & RBAC
* **Role-Based Routing:** Intelligent login redirection maps users directly to their clinical workspaces (Admin, Doctor, Pharmacist, Reception, Lab).
* **JWT Security:** Stateless, encrypted sessions using JSON Web Tokens.
* **Dynamic Navigation:** The private navigation bar dynamically renders links and interfaces based on the authenticated user's permission tier.

### 👨‍⚕️ Clinical Workspace (Doctor Dashboard)
* **Patient Queue Management:** Segmented controls for "Waiting Room" and "Patient History".
* **Consultation Module:** Streamlined interface for capturing vitals, chief complaints, and clinical diagnoses.
* **Smart Prescription Pad:** Dynamic rows for medication allocation, automatic dosage formatting, and integrated lab test orders.
* **Print Preview:** Auto-generated, A4-formatted medical prescriptions ready for physical printing.
* **Longitudinal Records:** Immediate access to rich historical patient data and previous encounters.

### 💊 Pharmacy & Inventory System
* **Real-Time Dispensing:** Live-search patient directory with automatic quantity calculation based on dosage metrics (e.g., `1-0-1` for `5 Days` = `10 Units`).
* **Inventory Command Center:** Full CRUD capabilities for medical stock.
* **Automated Auditing:** Medicine dispensation automatically decrements database inventory quantities.
* **Expiry & Stock Alerts:** Visual status badges flag low stock (<10 units) and impending expiration dates (<30 days).

### 📊 Hospital Director (Admin) Dashboard
* **Executive KPI Tracking:** Real-time metrics for total patients, inventory valuation, active prescriptions, and staff count.
* **Personnel Management:** Form-driven staff recruitment, credential resets, and access revocation.
* **Directory:** Comprehensive listing of all active hospital staff and their designated security roles.

---

## 🏗️ System Architecture



[Image of MERN stack architecture diagram]


The system utilizes a decoupled architecture where the React frontend communicates asynchronously with the Node/Express backend via a RESTful API.

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **Frontend** | React.js, React Router, Axios | Handles UI rendering, state management, and API consumption. |
| **Backend** | Node.js, Express.js | Exposes RESTful endpoints, processes business logic, and manages auth. |
| **Database** | MongoDB, Mongoose | NoSQL data persistence with structured document schemas. |
| **Security** | JWT, Bcrypt.js | Password hashing and secure endpoint protection. |

---

## 💻 UI / UX Highlights
* **Top-Tier Industry Standard Design:** Clean, distraction-free clinical workspaces utilizing a "Slate & White" SaaS aesthetic.
* **CSS-in-JS & Modular CSS:** Scalable styling architecture ensuring no element overlapping or UI congestion.
* **Feedback Loops:** Toast notifications and distinct active-states for all user interactions.

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v16.x or higher)
* MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/charity-hospital-system.git](https://github.com/yourusername/charity-hospital-system.git)
cd charity-hospital-system

```

### 2. Backend Setup

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory and configure your variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development

```

Start the backend server:

```bash
npm run server

```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd client
npm install

```

Start the React development server:

```bash
npm start

```

The application will be accessible at `http://localhost:3000`.

---

## 🛡️ Security Implementations

* **Route Protection:** All API endpoints manipulating sensitive clinical or inventory data are wrapped in a `protect` middleware verifying the Bearer token.
* **Role Verification:** Critical actions (e.g., deleting stock) utilize an `authorize` middleware array to prevent lower-tier roles from executing unauthorized HTTP methods.
* **Password Encryption:** Salt and hashing applied to all personnel credentials before database insertion.

---

## 📄 License

This project is licensed under the MIT License.

---

### 👨‍💻 Author
Created by **Bipul Das**.  
[GitHub](https://github.com/Bipul-Das) • [LinkedIn](https://linkedin.com/in/bipuldas-cse)  

