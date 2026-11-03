import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './lib/AppContext'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import { About, Contact, Courses, CourseDetail, Login, NotFound, Register, Timetable } from './pages/Public'
import AppLayout from './pages/app/AppLayout'
import Overview from './pages/app/Overview'
import { Learn, MyCourses } from './pages/app/Learn'
import { Billing, Certificates, Progress, QuizRunner, Quizzes, Resources, Schedule, SettingsPage } from './pages/app/More'

// HashRouter keeps routing working on any static host with no server rewrites.
// When you deploy to Vercel/Netlify you can switch to BrowserRouter (see SETUP_GUIDE).
export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="courses/:id" element={<Learn />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="resources" element={<Resources />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quizzes/:id" element={<QuizRunner />} />
            <Route path="progress" element={<Progress />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </HashRouter>
  )
}
