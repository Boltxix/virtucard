// Importing necessary modules from react-router-dom
import { createBrowserRouter, RouterProvider, Outlet, } from "react-router-dom";
// Importing pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Event from "./pages/Event"
// Importing necessary components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// Importing styles
import "./style.scss"
// Importing QueryClient and QueryClientProvider from react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Creating a new instance of QueryClient
const queryClient = new QueryClient()

// Defining the layout of the app
const Layout = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  )
}

// Creating the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/post/:id",
        element: <Single />
      },
      {
        path: "/write",
        element: <Write />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/events",
        element: <Events />
      },
      {
        path: "/events/:id",
        element: <Event />
      },



    ]
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
])

// Defining the main App component
function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

// Exporting the App component
export default App;
