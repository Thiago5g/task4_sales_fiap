const { cliente } = require('pg');

const cliente = new cliente({
  host: 'completely-buoyant-escargot.data-1.use1.tembo.io',
  port: 5432,
  user: 'postgres',
  password: 'WMF2fEPSPWfybDovmb', // Substitua pela senha correta
  database: 'postgres',
});

cliente.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL!'))
  .catch(err => console.error('❌ Erro na conexão:', err))
  .finally(() => cliente.end());
