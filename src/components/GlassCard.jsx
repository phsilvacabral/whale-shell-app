export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div className={`glass-card ${hover ? '' : 'hover:transform-none'} ${className}`}>
      {children}
    </div>
  );
}
