import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import studentService from './supabase/StudentService';
import NotFoundPage from './pages/NotFoundPage';

// Import layouts
import StudentLayout from './components/StudentLayout';
import EmployerLayout from './components/EmployerLayout';

// Import Pages for Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import JobsPage from './pages/student/JobsPage';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import InterviewsPage from './pages/student/InterviewsPage';
import PlacementsPage from './pages/student/PlacementsPage';

// Import Pages for Employer
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import JobManagementPage from './pages/employer/JobManagementPage';
import EmployerApplicationsPage from './pages/employer/ApplicationsPage';
import EmployerInterviewPage from './pages/employer/InterviewPage';
import EmployerPlacementsPage from './pages/employer/PlacementsPage';

// Import Authentication Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { setAuthenticated, setUnauthenticated } from './store/authSlice';


function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}



function AppContent() {

  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchAndInitializeUser = async () => {
      try {
        const userResp = await studentService.getUser();
        if (!userResp.success) {
          console.log(userResp.error);
          dispatch(setUnauthenticated());
          return;
        }

        const role = userResp.user.user_metadata?.role;
        let data;
        if (role === 'student') {
          data = userResp.user.user_metadata?.usn;
        } else {
          data = userResp.user.user_metadata?.employerId;
        }
        dispatch(setAuthenticated({ role, data }));
      } catch (error) {
        console.log('Error fetching user:', error);
        dispatch(setUnauthenticated());
      }
    };

    fetchAndInitializeUser().then(() => setInitialized(true));
  }, [dispatch]);

  if (!initialized) {
    return <div>Loading...</div>; 
  }


  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="job/:jobid" element={<JobDetailsPage/>} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="placements" element={<PlacementsPage />} />
        </Route>

        {/* Employer Routes */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="jobs" element={<JobManagementPage />} />
          <Route path="applications" element={<EmployerApplicationsPage />} />
          <Route path="interviews" element={<EmployerInterviewPage />} />
          <Route path="placements" element={<EmployerPlacementsPage />} />
        </Route>

        {/* 404 Page Not Found */}
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}


export default App;