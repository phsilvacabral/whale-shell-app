import GlassCard from '../components/GlassCard';

export default function Home() {
  const DASHBOARD_MFE_URL = import.meta.env.VITE_DASHBOARD_URL || 'https://red-desert-069ed9f0f.3.azurestaticapps.net/';

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
          🐋 Whale - Gerenciamento de Criptomoedas
        </h1>
        
        <GlassCard hover={false} className="p-8">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Top 12 Criptomoedas
          </h2>
          
          <div className="rounded-2xl overflow-hidden">
            <iframe 
              src={DASHBOARD_MFE_URL}
              className="w-full h-[600px] border-none"
              title="Dashboard Criptomoedas"
              style={{ background: 'transparent' }}
            />
          </div>
        </GlassCard>

        <div className="mt-8 text-center">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Acompanhe as principais criptomoedas em tempo real
          </p>
        </div>
      </div>
    </div>
  );
}
