import express from 'express';

const connection = require('./conf');
const app = express.Router();



const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/* GET index page. */
app.get('/', (req, res) => {
  res.send('Express');
});

// Recupere l'ensemble des données //
app.get('/api/recherche', (req, res) => {
  connection.query('SELECT * from Animaux_recherches', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des animaux');
    } else {
      res.json(results);
    }
  });
})

//Recupere d'un champ specifique//
app.get('/api/recherche/lieux', (req, res) => {
  connection.query('SELECT lieu_perte from Animaux_recherches', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des lieux');
    } else {
      res.json(results);
    }
  });
});

//Recupere d'un ensemble de donnees en fonction de filtres//

//Filtre contient le type 'chien'//
app.get('/api/recherche/types', (req, res) => {
  connection.query("SELECT * from Animaux_recherches WHERE type LIKE 'chien'", (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des types contenant le mot chien');
    } else {
      res.json(results);
    }
  });
});

//Filtre commencant par la lettre m//
app.get('/api/recherche/villes', (req, res) => {
  connection.query("SELECT * from Animaux_recherches WHERE lieu_perte LIKE 'm%'", (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des lieux commençant par la lettre m');
    } else {
      res.json(results);
    }
  });
});

//Filtre supérieur à date indiquée//
app.get('/api/recherche/date', (req, res) => {
  connection.query("SELECT * from Animaux_recherches WHERE date_perte > '2010-04-01'", (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des dates supérieures à 2010');
    } else {
      res.json(results);
    }
  });
});

//Récupération des données ordonnées//
app.get('/api/recherche/:ordre', (req, res) => {
  const idAnimaux = req.params.ordre
  if (idAnimaux === 'ASC') {
    connection.query('SELECT * from Animaux_recherches ORDER BY identifiant ASC', (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des identifiants dans l\'ordre ascendant');
      } else {
        res.json(results);
      }
    });
  } else if (idAnimaux === 'DESC') {
    connection.query('SELECT * from Animaux_recherches ORDER BY identifiant DESC', (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des identifiants dans l\'ordre descendant');
      } else {
        res.json(results);
      }
    });
  }
});

//Sauvegarde d'une nouvelle entite//
app.post('/api/recherche/new', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO Animaux_recherches SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un animal");
    } else {
      res.sendStatus(200);
    }
  });
});

//Modification d'une entite//
app.put('/api/recherche/:id', (req, res) => {
  const idAnimaux = req.params.id;
  const formData = req.body;

  connection.query('UPDATE Animaux_recherches SET ? WHERE id = ?', [formData, idAnimaux], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un animal");
    } else {
      res.sendStatus(200);
    }
  });
});

//Modification toggle du boleen//
app.put('/api/recherche/modif/:id', (req, res) => {
  const idAnimaux = req.params.id;

  connection.query('UPDATE Animaux_recherches SET retrouve = NOT retrouve WHERE id = ?', [idAnimaux], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un animal");
    } else {
      res.sendStatus(200);
    }
  });
});

//Suppression d'une entite//
app.delete('/api/recherche/delete/:id', (req, res) => {
  const idAnimaux = req.params.id;

  connection.query('DELETE FROM Animaux_recherches WHERE id = ?', [idAnimaux], err => {
      if (err) {
          console.log(err);
          res.status(500).send("Erreur lors de la suppression d'un film");
      } else {
          res.sendStatus(200);
      }
  });
});

//Suppression de toutes les entités dont le booléen est false//
app.delete('/api/recherche/deleteall', (req, res) => {

  connection.query('DELETE FROM Animaux_recherches WHERE retrouve = FALSE', (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send("Erreur lors de la suppression des films");
      } else {
          res.sendStatus(200);
      }
  });
});




export default app;
