import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from "react-router-dom";
import AddSong from "./pages/AddSong";
import AddAlbum from './pages/AddAlbum';
import ListSong from './pages/ListSong';
import ListAlbum from './pages/ListAlbum';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
export const url = 'http://localhost:4000'

const AdminDashboard = () => {
  return (
    <div className='flex items-start min-h-screen'>
      <ToastContainer/>
      <Sidebar/>

      <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
        <Navbar/>
        <div className='pt-8 pl-5 sm: pt-12 pl-12'>
          <Routes>
            <Route path='/add-song' element={<AddSong/>}/>
            <Route path='/add-album' element={<AddAlbum/>}/>
            <Route path='/list-song' element={<ListSong/>}/>
            <Route path='/list-album' element={<ListAlbum/>}/>
            {/* <Route path='/' element={<Navigate to="/list-song" />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        {/* <Route path="/" element={<Navigate to="/list-song" />} /> */}
        <Route path="/list-song" element={
          <ProtectedRoute>
            <ListSong />
          </ProtectedRoute>
        } />
        <Route path="/list-album" element={
          <ProtectedRoute>
            <ListAlbum />
          </ProtectedRoute>
        } />
        <Route path="/add-song" element={
          <ProtectedRoute>
            <AddSong />
          </ProtectedRoute>
        } />
        <Route path="/add-album" element={
          <ProtectedRoute>
            <AddAlbum />
          </ProtectedRoute>
        } />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;