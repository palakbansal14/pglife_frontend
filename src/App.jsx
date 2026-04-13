import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import WishlistPage from './pages/WishlistPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AddListingPage from './pages/AddListingPage';
import EditListingPage from './pages/EditListingPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import BuyCreditsPage from './pages/BuyCreditsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Chatbot from './components/chatbot/Chatbot';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#eb5213', secondary: '#fff' } }
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/buy-credits" element={<BuyCreditsPage />} />
            </Route>

            <Route element={<ProtectedRoute ownerOnly />}>
              <Route path="/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/dashboard/add" element={<AddListingPage />} />
              <Route path="/dashboard/edit/:id" element={<EditListingPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  );
}
