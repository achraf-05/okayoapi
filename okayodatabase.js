const { Client } = require('pg');

const client = new Client({
  user: 'postgres', 
  host: 'localhost',
  database: 'okayodatabase', 
  password: 'root', 
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to the database successfully'))
  .catch(err => console.error('Database connection error:', err));

module.exports = client;
