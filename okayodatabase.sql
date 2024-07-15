-- Table Clients
CREATE TABLE Clients (
    ID SERIAL PRIMARY KEY,
    Code TEXT NOT NULL,
    RaisonSociale TEXT NOT NULL,
    Adresse TEXT
);

-- Table Produits
CREATE TABLE Produits (
    ID SERIAL PRIMARY KEY,
    Code TEXT NOT NULL,
    Nom TEXT NOT NULL,
    PrixUnitaireHT REAL NOT NULL
);

-- Table Factures
CREATE TABLE Factures (
    ID SERIAL PRIMARY KEY,
    Reference TEXT NOT NULL,
    DateFacturation DATE NOT NULL,
    DateEcheance DATE NOT NULL,
    ClientID INTEGER REFERENCES Clients(ID),
    TotalHT REAL NOT NULL,
    TotalTTC REAL NOT NULL
);

-- Table LigneFactures
CREATE TABLE LigneFactures (
    ID SERIAL PRIMARY KEY,
    FactureID INTEGER REFERENCES Factures(ID),
    ProduitID INTEGER REFERENCES Produits(ID),
    Designation TEXT NOT NULL,
    PrixUnitaireHT REAL NOT NULL,
    Quantite INTEGER NOT NULL,
    TauxTVA REAL NOT NULL,
    TotalHT REAL NOT NULL
);
