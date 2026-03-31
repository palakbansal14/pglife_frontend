# PG Life — Frontend

Built with **ReactJS + Vite + Tailwind CSS + Framer Motion**

## 📁 Folder Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx         # OTP login modal (3-step flow)
│   │   ├── chatbot/
│   │   │   └── Chatbot.jsx           # Floating AI chatbot widget
│   │   ├── common/
│   │   │   └── ProtectedRoute.jsx    # Auth + role-based route guard
│   │   ├── layout/
│   │   │   ├── Layout.jsx            # Root layout wrapper
│   │   │   ├── Navbar.jsx            # Sticky nav with user dropdown
│   │   │   └── Footer.jsx            # Site footer
│   │   └── listings/
│   │       ├── ListingCard.jsx       # PG card with wishlist toggle
│   │       ├── FilterPanel.jsx       # Multi-filter search bar
│   │       └── ReviewSection.jsx     # Reviews + star rating
│   ├── context/
│   │   └── AuthContext.jsx           # Global auth state
│   ├── pages/
│   │   ├── HomePage.jsx              # Hero + city cards + featured listings
│   │   ├── ListingsPage.jsx          # Browse all PGs with filters
│   │   ├── ListingDetailPage.jsx     # Full PG details + gallery + map
│   │   ├── WishlistPage.jsx          # Saved listings
│   │   ├── OwnerDashboardPage.jsx    # Owner stats + listings manager
│   │   ├── AddListingPage.jsx        # Add new PG form
│   │   ├── EditListingPage.jsx       # Edit existing listing
│   │   ├── ProfilePage.jsx           # User profile settings
│   │   └── NotFoundPage.jsx          # 404 page
│   ├── services/
│   │   └── api.js                    # Axios instance with JWT interceptor
│   ├── App.jsx                       # Routes definition
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🚀 Setup & Run

```bash
cd frontend
npm install
cp .env.example .env    # Add your API URL & Google Maps key
npm run dev             # Start dev server at localhost:5173
npm run build           # Production build
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#eb5213` (Brand Orange) |
| Font Display | Playfair Display |
| Font Body | DM Sans |
| Border Radius | `1rem` / `1.5rem` / `2rem` |
| Shadow Card | `0 2px 20px rgba(0,0,0,0.08)` |

## 📱 Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Home | Public |
| `/listings` | Browse PGs | Public |
| `/listings/:id` | PG Detail | Public |
| `/wishlist` | Saved PGs | Login required |
| `/profile` | Profile | Login required |
| `/dashboard` | Owner Dashboard | Owner only |
| `/dashboard/add` | Add Listing | Owner only |
| `/dashboard/edit/:id` | Edit Listing | Owner only |

## ⚙️ Key Features

- **OTP Auth Modal** — 3-step: Phone → OTP → Register (role selection)
- **Smart Filters** — City, Gender, Budget, Locality, Amenities, Sort
- **Wishlist** — Toggle save/unsave with instant feedback
- **AI Chatbot** — Floating chat with NLP intent parsing + redirect to results
- **Owner Dashboard** — Stats cards, listing toggle, edit/delete
- **Reviews** — Star rating + comment submission with live updates
- **Framer Motion** — Page transitions, staggered cards, modal animations
