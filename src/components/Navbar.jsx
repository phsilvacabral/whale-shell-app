import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, logout, isAnonymous } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-pill">
      <div className="flex items-center gap-8">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/portfolio" 
          className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`}
        >
          Portfolio
        </Link>
        {!isAnonymous && user && (
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            Perfil
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User size={16} />
              <span>{isAnonymous ? 'Anônimo' : user.name}</span>
            </div>
            {!isAnonymous && (
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
