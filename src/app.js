const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 5000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configuration de la base de données
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'okayodatabase',
  password: 'root',
  port: 5432,
});
client.connect()

// Configuration de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Facturation',
      version: '1.0.0',
      description: 'Documentation de l\'API pour la gestion des factures',
    },
  },
  apis: ['./swaggerDef.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint pour récupérer toutes les factures
app.get('/factures', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM factures');
    res.json({
      message: "success",
      data: result.rows
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint pour récupérer une facture par ID
app.get('/factures/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await client.query('SELECT * FROM factures WHERE id = $1', [id]);
    res.json({
      message: "success",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint pour créer une nouvelle facture
app.post('/factures', async (req, res) => {
  const { reference, datefacturation, dateecheance, clientid, totalht, totalttc, lignesfacture } = req.body;
  if (!reference || !datefacturation || !dateecheance || !clientid || !totalht || !totalttc || !lignesfacture) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }
  try {
    await client.query('BEGIN');
    const factureResult = await client.query(
      'INSERT INTO factures (reference, datefacturation, dateecheance, clientid, totalht, totalttc) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [reference, datefacturation, dateecheance, clientid, totalht, totalttc]
    );
    const factureID = factureResult.rows[0].id;

    for (const ligne of lignesfacture) {
      const { produitid, designation, prixunitaireht, quantite, tauxtva, totalht } = ligne;
      await client.query(
        'INSERT INTO lignesfacture (factureid, produitid, designation, prixunitaireht, quantite, tauxtva, totalht) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [factureID, produitid, designation, prixunitaireht, quantite, tauxtva, totalht]
      );
    }

    await client.query('COMMIT');
    res.json({
      message: "success",
      data: req.body,
      id: factureID
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

// Endpoint pour récupérer tous les produits
app.get('/produits', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM produits');
    res.json({
      message: "success",
      data: result.rows
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint pour créer un nouveau produit
app.post('/produits', async (req, res) => {
  const { code, nom, prixunitaireht } = req.body;
  if (!code || !nom || !prixunitaireht) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }
  try {
    const result = await client.query(
      'INSERT INTO produits (code, nom, prixunitaireht) VALUES ($1, $2, $3) RETURNING id',
      [code, nom, prixunitaireht]
    );
    res.json({
      message: "success",
      data: req.body,
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint pour récupérer tous les clients
app.get('/clients', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM clients');
    res.json({
      message: "success",
      data: result.rows
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint pour créer un nouveau client
app.post('/clients', async (req, res) => {
  const { code, raisonsociale, adresse } = req.body;
  if (!code || !raisonsociale || !adresse) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }
  try {
    const result = await client.query(
      'INSERT INTO clients (code, raisonsociale, adresse) VALUES ($1, $2, $3) RETURNING id',
      [code, raisonsociale, adresse]
    );
    res.json({
      message: "success",
      data: req.body,
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
