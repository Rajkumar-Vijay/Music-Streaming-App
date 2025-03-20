import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { admin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="navbar w-full border-b-2 border-gray-800 px-5 sm:px-12 py-4 text-lg flex justify-between items-center">
            <p>Admin Panel</p>
            {admin && (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Welcome, {admin.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;