const express = require('express');
const bodyParser = require('body-parser');
const client = require('./okayodatabase');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();
const port = 5000;

app.use(bodyParser.json());

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

app.post('/factures', async (req, res) => {
  const { reference, datefacturation, dateecheance, clientid, totalht, totalttc, lignesfacture } = req.body;
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

app.get('/produits', async (req, res) => {
  try {
    console.log('Tentative de récupération des produits...');
    const result = await client.query('SELECT * FROM produits');
    console.log('Produits récupérés avec succès');
    res.json({
      message: "success",
      data: result.rows
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/produits', async (req, res) => {
  const { code, nom, prixunitaireht } = req.body;
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

app.post('/clients', async (req, res) => {
  const { code, raisonsociale, adresse } = req.body;
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
