import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, startAnonymous } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/portfolio');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = () => {
    startAnonymous();
    navigate('/portfolio');
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-md mx-auto">
        <GlassCard>
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            Login
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Senha
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Não tem uma conta?{' '}
              <Link to="/register" className="text-[var(--accent-blue)] hover:underline">
                Cadastre-se
              </Link>
            </p>

            <div className="border-t border-white/10 pt-4">
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Ou continue sem cadastro:
              </p>
              <button
                onClick={handleAnonymous}
                className="btn-secondary w-full"
              >
                Continuar Anonimamente
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
