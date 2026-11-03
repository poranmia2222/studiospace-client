
<div align="center">

# 🎨 StudioSpace

### Find Your Space. Create Something Extraordinary.

A creative workspace marketplace where creators discover, explore, and book inspiring studios for their next big project.

<br />

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-Visit_StudioSpace-477E4D?style=for-the-badge)](https://studiospace-client-flax.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Client_Repository-181717?style=for-the-badge&logo=github)](https://github.com/poranmia2222/studiospace-client)
[![Server](https://img.shields.io/badge/GitHub-Server_Repository-181717?style=for-the-badge&logo=github)](https://github.com/poranmia2222/studiospace-server)

<br />

![StudioSpace](https://img.shields.io/badge/StudioSpace-Creative_Workspace_Platform-477E4D?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styled-06B6D4?style=flat-square&logo=tailwindcss)

</div>

---

## 📖 About The Project

**StudioSpace** is a peer-to-peer creative workspace and production studio sharing platform designed to connect creative professionals with the perfect spaces for their projects.

Whether someone needs a photography studio, music recording room, video production space, or creative workspace, StudioSpace makes discovering and booking spaces simple and convenient.

The platform also allows studio owners to showcase their spaces and manage their listings.

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏠 Modern Homepage | Explore creative spaces through an attractive and responsive interface. |
| 🔍 Studio Discovery | Browse and discover available creative studios. |
| 🏢 Studio Details | Explore studio information, facilities, pricing, and availability. |
| 🔐 Authentication | Secure user authentication powered by Better Auth. |
| ➕ Add Studio | Authenticated users can publish their studio listings. |
| ✏️ Manage Studios | Update and manage existing studio information. |
| 📅 Booking System | Book creative spaces for selected dates and time slots. |
| 📋 My Bookings | View and manage personal booking information. |
| 📄 Booking Details | View individual booking details. |
| 🛡️ Protected Routes | Restrict private pages and API operations to authenticated users. |
| 📱 Responsive Design | Optimized for desktop, tablet, and mobile devices. |

## 🖥️ Technologies Used

### 🎨 Frontend

<div>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white)

</div>

### ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### 🔐 Authentication & Security

- Better Auth
- JWT verification using JOSE
- Protected API endpoints
- Authenticated booking operations

### 🚀 Deployment & Tools

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)

---

## 📸 Project Preview

<div align="center">

### 🏡 StudioSpace Homepage

[![Visit StudioSpace](https://img.shields.io/badge/Click_Here-Explore_Live_Project-477E4D?style=for-the-badge)](https://studiospace-client-flax.vercel.app/)

</div>

---

## ⚙️ Installation & Setup

Follow these steps to run StudioSpace locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/poranmia2222/studiospace-client.git
```

### 2️⃣ Navigate to the Project Directory

```bash
cd studiospace-client
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

Replace the placeholder values with your actual credentials.

### 5️⃣ Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## 📂 Project Structure

```text
studiospace-client/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── studios/
│   │   ├── my-bookings/
│   │   ├── add-studio/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── types/
│
├── .env.local
├── next.config.ts
├── package.json
└── README.md
```

> 📝 This is an illustrative folder structure. Adjust it to match your actual project.

---

## 🌐 Backend API

StudioSpace uses a separate REST API built with Express.js and MongoDB.

🔗 **Server Repository:** [studiospace-server](https://github.com/poranmia2222/studiospace-server)

The backend is responsible for:

- 🏢 Studio creation and management
- 🔍 Studio discovery and details
- 📅 Booking creation and management
- 👤 User-specific booking retrieval
- ❌ Booking cancellation
- 🔐 JWT authentication and authorization

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `MONGODB_URI` | MongoDB connection string |
| `BETTER_AUTH_SECRET` | Better Auth secret key |
| `BETTER_AUTH_URL` | Frontend application URL |

⚠️ **Security Note:** Never commit `.env.local` or expose private credentials in your public repository.

---

## 🚀 Deployment

The frontend is deployed on **Vercel**.

To deploy your own version:

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Configure the backend's allowed frontend origin.
5. Deploy your application.

---

## 👨‍💻 Author

<div align="center">

### Poran Mia

**Full Stack Developer | MERN Stack Developer**

Passionate about building modern web applications and creating useful digital experiences.

[![GitHub](https://img.shields.io/badge/GitHub-poranmia2222-181717?style=for-the-badge&logo=github)](https://github.com/poranmia2222)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Poran_Mia-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/poranmia/)

</div>

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

**Made with ❤️ by Poran Mia**

*StudioSpace — Find your space. Create something extraordinary.*

</div>
