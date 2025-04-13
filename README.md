# Stickify ✍️ — Built to help you stick with your thoughts!

Stickify is a personalized notes application built using **React**, **TypeScript**, **Tailwind CSS**, and **Firebase**. It allows users to create, view, edit, delete, and filter notes by date, week, or month. Stickify also provides a smooth user experience with Firebase authentication using **Google Sign-In** and **Redux Toolkit** for state management.

---

## ✨ Features

- 🔐 **User Authentication**: Google Sign-In via Firebase
- 📝 **CRUD Notes**: Create, read, update, and delete notes
- 📅 **Note Filtering**: Filter by day, week, or month
- 🧠 **Global State Management**: Powered by Redux Toolkit
- 🔥 **Realtime Sync**: Data synced using Firestore
- 📦 **Custom Modals & Toasts**: Beautiful modals and toast notifications
- 💡 **Responsive UI**: Tailwind-powered responsive design

---

## 🛠 Tech Stack

| Tech          | Description                        |
| ------------- | ---------------------------------- |
| React + TS    | Frontend framework with TypeScript |
| Redux Toolkit | State management & RTK Query       |
| Firebase      | Auth (Google) + Firestore backend  |
| Tailwind CSS  | Modern utility-first styling       |
| React Router  | Page routing                       |
| React Icons   | Icon system                        |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aryan-Sanghi-008/StickyFy.git
cd stickify
```

### 2. Folder Structure

```bash
src/
├── assets/           # Icons, images, etc.
├── components/       # UI components (Toaster, Modals, Buttons)
├── pages/            # LoginPage, NotesPage, etc.
├── layouts/          # AppLayout, authentication wrappers
├── store/            # Redux slices & store config
│   ├── slices/       # authSlice, toastSlice, notesSlice
│   └── store.ts      # Redux root store
├── lib/              # firebase.ts config
├── types/            # TypeScript interfaces and types
├── App.tsx           # Main entry point
└── main.tsx          # Vite root mount
```
