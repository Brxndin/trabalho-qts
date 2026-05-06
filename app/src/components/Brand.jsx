export default function Brand({ subtitle = false, compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <div className="brand-mark">♡</div>
      <div>
        <div className="brand-title">Cardio Clínica</div>
        {subtitle && <div className="brand-subtitle">Sistema de gestão de saúde</div>}
      </div>
    </div>
  );
}
