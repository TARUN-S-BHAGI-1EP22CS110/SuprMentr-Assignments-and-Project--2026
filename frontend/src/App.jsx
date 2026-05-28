import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ ADDED

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Loading from "./components/loading/Loading";

import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import Lecture from "./pages/lecture/Lecture";

import { UserData } from "./context/UserContext";
import MyCourses from "./pages/mycourses/MyCourses";
import CourseProgress from "./pages/courseprogress/CourseProgress";
import Quiz from "./pages/quiz/Quiz";
import QuizStart from "./pages/quiz/QuizStart";
import Result from "./pages/quiz/Result";
import Certificate from "./pages/certificate/Certificate";
import CertificateVerify from "./pages/verify/CertificateVerify";
import Certificates from "./pages/certificates/Certificates";
import Layout from "./admin/Utils/Layout";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import AdminQuiz from "./admin/Quiz/AdminQuiz";
const App = () => {
  const { isAuth, loading, user } = UserData();
const isAdmin =
  isAuth && user && (user.role === "admin" || user.role === "superadmin");

  return (
    <BrowserRouter>

      {/* ✅ TOAST MESSAGES WILL SHOW NOW */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="app-container">

        {loading && <Loading />}

        {!loading && (
          <>
            <Header />

            <Routes>

              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDescription />} />
              
              <Route
                path="/my-courses"
                element={isAuth ? <MyCourses /> : <Navigate to="/login" />}
             />

            <Route
               path="/my-course/:id"
               element={isAuth ? <CourseProgress /> : <Navigate to="/login" />}
              />
              {/* QUIZ */}
            {/* QUIZ FLOW */}

{/* QUIZ FLOW */}

<Route
  path="/quiz-start/:id"
  element={isAuth ? <QuizStart /> : <Navigate to="/login" />}
/>

<Route
  path="/quiz/:id"
  element={isAuth ? <Quiz /> : <Navigate to="/login" />}
/>

<Route
  path="/result/:id"
  element={isAuth ? <Result /> : <Navigate to="/login" />}
/>
<Route
  path="/certificates"
  element={isAuth ? <Certificates /> : <Navigate to="/login" />}
/>
                {/* CERTIFICATE */}
                <Route
                  path="/certificate/:id"
                  element={isAuth ? <Certificate /> : <Navigate to="/login" />}
                />

                {/* VERIFY (PUBLIC) */}
                <Route
                  path="/verify/:certId"
                  element={<CertificateVerify />}
                />

              {/* PROTECTED */}
              <Route
                path="/course/study/:id"
                element={
                  isAuth ? <Lecture user={user} /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/account"
                element={isAuth ? <Account /> : <Navigate to="/login" />}
              />

              {/* AUTH */}
              <Route
                path="/login"
                element={!isAuth ? <Login /> : <Navigate to="/" />}
              />

              <Route
                path="/register"
                element={!isAuth ? <Register /> : <Navigate to="/" />}
              />

              <Route
                path="/verify"
                element={!isAuth ? <Verify /> : <Navigate to="/" />}
              />

              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset/:token" element={<ResetPassword />} />

              {/* ADMIN */}
              <Route
                path="/admin/dashboard"
                element={
                  isAdmin ? (
                    <Layout>
                      <AdminDashbord user={user} />
                    </Layout>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              <Route
                path="/admin/course"
                element={
                  isAdmin ? (
                    <Layout>
                      <AdminCourses user={user} />
                    </Layout>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/quiz/:id"
                 element={
                 isAdmin ? (
                <Layout>
                   <AdminQuiz />
                    </Layout>
                        ) : (
                      <Navigate to="/" />
    )
  }
/>


              <Route
                path="/admin/users"
                element={
                  isAdmin ? (
                    <Layout>
                      <AdminUsers user={user} />
                    </Layout>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />


              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>

            <Footer />
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;