/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Common';
import { Home } from './pages/Home';
import { Timetable } from './pages/Timetable';
import { TimetableDetail } from './pages/TimetableDetail';
import { SearchResults } from './pages/SearchResults';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Rooms } from './pages/admin/Rooms';
import { Teachers } from './pages/admin/Teachers';
import { Schedules } from './pages/admin/Schedules';
import { Classes } from './pages/admin/Classes';
import { Subjects } from './pages/admin/Subjects';
import { Settings } from './pages/admin/Settings';
import { NotificationsPage } from './pages/admin/Notifications';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { DataProvider } from './lib/DataContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/timetable" element={<PublicLayout><Timetable /></PublicLayout>} />
            <Route path="/timetable/detail" element={<PublicLayout><TimetableDetail /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/admin/teachers" element={<PrivateRoute><Teachers /></PrivateRoute>} />
            <Route path="/admin/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
            <Route path="/admin/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
            <Route path="/admin/schedules" element={<PrivateRoute><Schedules /></PrivateRoute>} />
            <Route path="/admin/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            {/* We can add more admin routes here as they are created */}
            <Route path="/admin/:any" element={<PrivateRoute><div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">Page en cours de développement...</div></PrivateRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

