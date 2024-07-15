/**
 * @swagger
 * components:
 *   schemas:
 *     Facture:
 *       type: object
 *       properties:
 *         reference:
 *           type: string
 *         datefacturation:
 *           type: string
 *           format: date
 *         dateecheance:
 *           type: string
 *           format: date
 *         clientid:
 *           type: integer
 *         totalht:
 *           type: number
 *         totalttc:
 *           type: number
 *         lignesfacture:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               produitid:
 *                 type: integer
 *               designation:
 *                 type: string
 *               prixunitaireht:
 *                 type: number
 *               quantite:
 *                 type: integer
 *               tauxtva:
 *                 type: number
 *               totalht:
 *                 type: number
 *     Produit:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         nom:
 *           type: string
 *         prixunitaireht:
 *           type: number
 *     Client:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         raisonsociale:
 *           type: string
 *         adresse:
 *           type: string
 */

/**
 * @swagger
 * /factures:
 *   get:
 *     summary: Récupérer toutes les factures
 *     responses:
 *       200:
 *         description: Une liste de factures
 *       400:
 *         description: Erreur lors de la récupération
 */

/**
 * @swagger
 * /factures/{id}:
 *   get:
 *     summary: Récupérer une facture par ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la facture à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la facture
 *       400:
 *         description: Erreur lors de la récupération
 */

/**
 * @swagger
 * /factures:
 *   post:
 *     summary: Créer une nouvelle facture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Facture'
 *     responses:
 *       200:
 *         description: Facture créée avec succès
 *       400:
 *         description: Erreur lors de la création
 */

/**
 * @swagger
 * /produits:
 *   get:
 *     summary: Récupérer tous les produits
 *     responses:
 *       200:
 *         description: Une liste de produits
 *       400:
 *         description: Erreur lors de la récupération

 */

/**
 * @swagger
 * /produits:
 *   post:
 *     summary: Créer un nouveau produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produit'
 *     responses:
 *       200:
 *         description: Produit créé avec succès
 *       400:
 *         description: Erreur lors de la création

 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Récupérer tous les clients
 *     responses:
 *       200:
 *         description: Une liste de clients
 *       400:
 *         description: Erreur lors de la récupération

 */

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Créer un nouveau client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client créé avec succès
 *       400:
 *         description: Erreur lors de la création

 */

