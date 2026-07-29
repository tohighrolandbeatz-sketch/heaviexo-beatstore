'use client';

export default function AdminUsersPage() {
  return (
    <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px', color: '#fff' }}>
      <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', marginBottom: '20px' }}>
        👤 Liste des Utilisateurs & Clients
      </h2>
      <p style={{ fontSize: '13px', color: '#888' }}>Aucun utilisateur enregistré pour le moment.</p>
    </div>
  );
}