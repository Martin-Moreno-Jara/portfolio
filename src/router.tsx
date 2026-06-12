import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'

// 🔧 FIX ME (#4): there is no route for the Contact page yet. The navbar
// links to "/contact", but because the route below doesn't exist, clicking
// it drops you onto react-router's default 404 error screen.
// Hint: import the Contact page (src/pages/Contact.tsx) and add a child
// route: { path: 'contact', element: <Contact /> }
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'about', element: <About /> },
    ],
  },
])
