# Admin Web Application — SusRacker (Next.js Admin Dashboard)

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![NextAuth](https://img.shields.io/badge/NextAuth-5.0.0--beta.28-6E40C9?style=for-the-badge)](https://next-auth.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=github)](../LICENSE)

---

This module is the **Admin Dashboard** for SusRacker. It is a Next.js application that:

- Connects to the Central Server via **Socket.IO client** to receive real-time `new_alert` events and display them to authorized admins.
- Provides **CRUD operations** for the Criminals collection (create, read, update, delete).
- Secures access with **NextAuth** and server-side protection so only admins can view/manage sensitive data.

---

![Admin Dashboard!](/imgs/dashboard.jpg "Dashboard")

## Core Capabilities

- Real-time alert feed: listens to the central server (`new_alert`) and shows incoming alerts in a timeline/list.
- Criminals management: add, edit, delete criminal records (including image upload or base64 image handling).
- Secure admin auth: protected routes and API endpoints; session-based authentication using NextAuth (with JWT/cookie fallback as needed).
- Dashboard statistics: connected cameras, alert counts, breakdowns by type.

---

## Notable Dependencies (from `package.json`)

```json
{
  "next": "15.2.2",
  "react": "^19.0.0",
  "next-auth": "^5.0.0-beta.28",
  "mongoose": "^8.12.1",
  "mongodb": "^6.14.2",
  "bcryptjs": "^3.0.2",
  "cookie": "^1.0.2",
  "jsonwebtoken": "^9.0.2",
  "postcss": "^8.5.3"
}
```

## Environment Variables
```json
MONGODB_URI=mongodb://localhost:27017/susracker
```