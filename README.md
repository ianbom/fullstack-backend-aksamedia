# Employee Management System (EMS)

> Modern and professional Employee Management System built with React, TypeScript, and Tailwind CSS

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Key Features Details](#key-features-details)
- [Screenshots](#screenshots)

## 🎯 Overview

Employee Management System (EMS) is a modern, full-featured web application for managing employee data. Built entirely with React TypeScript and Tailwind CSS (no UI libraries), this application demonstrates best practices in frontend development including authentication, CRUD operations, theming, and responsive design.

All data is stored locally using `localStorage`, making it perfect for demos, prototypes, or offline-first applications.

## ✨ Features

### 🔐 Authentication
- ✅ Static credential-based login (no registration)
- ✅ Session persistence across page refreshes
- ✅ Protected routes with automatic redirection
- ✅ User profile management

### 👥 Employee Management (CRUD)
- ✅ Create, Read, Update, Delete employees
- ✅ Real-time search across name, phone, division, position
- ✅ Filter by division with active filter chips
- ✅ Custom pagination (no external libraries)
- ✅ File upload with drag & drop for employee photos
- ✅ Image preview and validation (type & size)

### 🎨 UI/UX
- ✅ Professional dark/light/system theme modes
- ✅ Automatic OS theme detection and synchronization
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Mobile sidebar with hamburger menu
- ✅ Custom dropdown components
- ✅ Glassmorphism effects and modern gradients
- ✅ Smooth animations and transitions

### 📊 State Management
- ✅ URL query string persistence for filters and pagination
- ✅ State preservation on page refresh
- ✅ Context API for global state (Auth, Theme)

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Build Tool** | Vite |
| **Routing** | React Router DOM v6 |
| **Storage** | localStorage |
| **Icons** | Material Icons |

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-aksamedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚀 Usage

### Login Credentials

```
Username: admin
Password: admin123
```

### Default Navigation

After login, you'll have access to:

- **Dashboard** - Overview with statistics and recent employees
- **Employees** - Full employee list with search, filter, and pagination
- **Add Employee** - Create new employee records
- **Profile** - Edit your user profile

### URL Query Parameters

The application uses URL query strings to maintain state:

```
/employees?page=2&search=john&division=div-001
```

- `page` - Current pagination page
- `search` - Search keyword
- `division` - Division filter ID

## 📁 Project Structure

```
frontend-aksamedia/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Dropdown.tsx          # Custom dropdown component
│   │   │   ├── LayoutPro.tsx         # Main layout wrapper
│   │   │   └── NavbarPro.tsx         # Navigation bar with theme & user menu
│   │   ├── ui/
│   │   │   └── Modal.tsx             # Reusable modal component
│   │   └── ProtectedRoute.tsx        # Route protection wrapper
│   ├── context/
│   │   ├── AuthContext.tsx           # Authentication state management
│   │   └── ThemeContext.tsx          # Theme state management
│   ├── hooks/
│   │   └── useQueryParams.ts         # Custom hook for URL query params
│   ├── pages/
│   │   ├── employees/
│   │   │   ├── EmployeeList.tsx      # Employee list with CRUD
│   │   │   └── EmployeeForm.tsx      # Employee create/edit form
│   │   ├── DashboardPro.tsx          # Dashboard page
│   │   ├── Login.tsx                 # Login page
│   │   └── ProfilePro.tsx            # User profile page
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── utils/
│   │   └── employeeService.ts        # localStorage CRUD operations
│   ├── App.tsx                       # Route configuration
│   ├── main.tsx                      # Application entry point
│   └── index.css                     # Global styles & Tailwind config
├── public/                           # Static assets
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── vite.config.ts                    # Vite build configuration
```

## 🔑 Key Features Details

### 1. Authentication System

**Implementation:**
- Context-based auth with `AuthContext`
- Credential validation against static config
- Session stored in `localStorage` key: `auth-storage`
- Auto-login on app initialization

**Files:**
- `src/context/AuthContext.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/pages/Login.tsx`

### 2. CRUD Operations

**Data Storage:**
- All employee data in `localStorage` key: `employees`
- Seed data auto-generated on first visit
- Supports: Create, Read, Update, Delete

**Features:**
- Search across multiple fields (name, phone, division, position)
- Division-based filtering
- Custom pagination (configurable page size)
- URL state synchronization

**Files:**
- `src/utils/employeeService.ts`
- `src/pages/employees/EmployeeList.tsx`
- `src/pages/employees/EmployeeForm.tsx`

### 3. Theme System

**Modes:**
- **Light** - Force light theme
- **Dark** - Force dark theme  
- **System** - Follow OS preference (default)

**Implementation:**
- `window.matchMedia('(prefers-color-scheme: dark)')` for OS detection
- Event listener for real-time OS theme changes
- Persisted in `localStorage` key: `theme-mode`

**Files:**
- `src/context/ThemeContext.tsx`
- `src/components/layout/NavbarPro.tsx`

### 4. State Persistence

**URL Query Params:**
- Managed by custom `useQueryParams` hook
- Synced with browser history API
- Enables bookmarkable filtered/paginated views

**localStorage Keys:**
- `auth-storage` - User authentication data
- `employees` - Employee records
- `theme-mode` - Theme preference

### 5. File Upload

**Features:**
- Drag & drop support
- Click to browse alternative
- Image preview before upload
- File type validation (image/*)
- File size validation (max 2MB)
- Base64 encoding for storage

**Implementation:**
- `src/pages/employees/EmployeeForm.tsx`


### Dashboard
Modern dashboard with employee statistics and recent additions.

### Employee List
Full CRUD interface with search, filter, and pagination.

### Dark Mode
Beautiful dark theme with proper contrast and readability.

### Mobile Responsive
Fully responsive design with mobile-optimized sidebar.

## 🎨 Design Highlights

- **Color Palette**: Modern cyan/blue primary with complementary gradients
- **Typography**: Clean sans-serif with proper hierarchy
- **Components**: Glassmorphism, shadows, and smooth animations
- **Icons**: Material Icons for consistent UI
- **Responsive**: Mobile-first approach with breakpoints

## 📝 Division Data

The application comes with 6 pre-configured divisions:

1. Mobile Apps
2. QA
3. Full Stack
4. Backend
5. Frontend
6. UI/UX Designer

## 🔧 Customization

### Change Login Credentials

Edit `src/context/AuthContext.tsx`:

```typescript
const STATIC_USER = {
  username: 'your-username',
  password: 'your-password',
  // ...
};
```

### Modify Divisions

Edit `src/utils/employeeService.ts`:

```typescript
export const DIVISIONS: Division[] = [
  { id: 'div-001', name: 'Your Division' },
  // ...
];
```

### Adjust Pagination

Edit page size in `src/pages/employees/EmployeeList.tsx`:

```typescript
const ITEMS_PER_PAGE = 10; // Change to your preferred value
```


## 📄 License

This project is created for educational/demonstration purposes.

## 👨‍💻 Author

Built with ❤️ using React, TypeScript, and Tailwind CSS

---

**Happy Coding!** 🚀
