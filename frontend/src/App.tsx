import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';

// Lazy-loaded routes for code-splitting
const AllBlogsPage = lazy(() => import('./pages/AllBlogsPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const CreateBlogPage = lazy(() => import('./pages/CreateBlogPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const CreateProjectPage = lazy(() => import('./pages/CreateProjectPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/blogs" element={<AllBlogsPage />} />
              <Route path="/post/:id" element={<BlogPostPage />} />
              <Route path="/create" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
              <Route path="/user/:username" element={<UserProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/projects/create" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
              <Route path="/projects/edit/:id" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
