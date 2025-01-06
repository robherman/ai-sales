import * as MsSQL from 'mssql';

async function testConnection() {
  try {
    console.debug('testinnnn ****************');
    const config = {
      user: 'globalfrozen-sa',
      password: 'bC$fVy-s3CuR3-Lt$4zu',
      database: 'GF_TESTPRICE1',
      server: '10.0.0.6',
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };

    console.log('Attempting to connect...');
    const pool = await new MsSQL.ConnectionPool(config).connect();
    console.log('Connected successfully!');
    await pool.close();
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
