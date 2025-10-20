import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { User, Mail, Calendar, Settings } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados do usuário
    setTimeout(() => {
      setUserData({
        ...user,
        created_at: '2024-01-15',
        last_login: new Date().toISOString(),
        total_portfolios: 1,
        total_transactions: 15
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Perfil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Usuário */}
          <div className="lg:col-span-2">
            <GlassCard>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <User size={24} />
                Informações Pessoais
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Nome
                  </label>
                  <div className="input-field bg-transparent border-dashed">
                    {userData?.name || 'Não informado'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email
                  </label>
                  <div className="input-field bg-transparent border-dashed flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {userData?.email || 'Não informado'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Membro desde
                  </label>
                  <div className="input-field bg-transparent border-dashed flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('pt-BR') : 'Não informado'}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Estatísticas */}
            <GlassCard className="mt-8">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                Estatísticas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-blue)' }}>
                    {userData?.total_portfolios || 0}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Portfolios
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-green)' }}>
                    {userData?.total_transactions || 0}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Transações
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-red)' }}>
                    {userData?.last_login ? 'Ativo' : 'Inativo'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Configurações */}
          <div>
            <GlassCard>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <Settings size={24} />
                Configurações
              </h2>
              
              <div className="space-y-4">
                <button className="btn-secondary w-full text-left">
                  Alterar Senha
                </button>
                
                <button className="btn-secondary w-full text-left">
                  Notificações
                </button>
                
                <button className="btn-secondary w-full text-left">
                  Privacidade
                </button>
                
                <button className="btn-secondary w-full text-left">
                  Exportar Dados
                </button>
                
                <div className="border-t border-white/10 pt-4">
                  <button 
                    onClick={logout}
                    className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                  >
                    Sair da Conta
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Informações da Conta */}
            <GlassCard className="mt-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Informações da Conta
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>ID do Usuário:</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-mono">
                    {userData?.id || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Último Login:</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {userData?.last_login ? new Date(userData.last_login).toLocaleString('pt-BR') : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Tipo de Conta:</span>
                  <span style={{ color: 'var(--accent-blue)' }}>
                    {userData?.is_premium ? 'Premium' : 'Gratuita'}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
