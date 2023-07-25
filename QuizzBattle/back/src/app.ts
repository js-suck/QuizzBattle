import express from "express";
import http from 'http';
import mongoose = require('mongoose');
import { mongoURI } from './config/db'
import { apiRouter } from './routers/apiRouter';
import { authenticateToken, createRoom, generateToken } from "./services/authentifiactionService";
import { TUser } from "./types/user";
import { initializeSocket } from "./config/socket";
const db = require('./db');
const app = express();
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);


const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 


app.use(express.urlencoded({ extended: false }));


app.post('/upload', upload.single('profileImage'), (req, res) => {

  if (!req['file']) {
    res.send('Aucun fichier sélectionné.');
  } else {

    res.send('Fichier uploadé avec succès.');
  }
});


initializeSocket(server)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Wood!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.User.findOne({ where: { email } })
  .then((user) => {
    if (user) {
      // Check if password is correct (TODO: replace with comparePassword when encrypted registration is available)
      if (comparePasswords(password, user.password.toString())) {
        const token = generateToken(user);
        console.log(token, "uii");
        res.status(200).send({ token }); 
      } else {
        res.status(401).send({ error: 'Invalid password' }); 
      }
    } else {
      res.status(404).send({ error: 'User not found' }); 
    }
  })
  .catch((error) => {
    // Error while querying the database
    console.log(error);
    res.status(500).send({ error: 'Internal server error' }); 
  });

});

app.post('/signup', (req, res) => {
  const { email, password, firstname, lastname, tokenemail } = req.body;

  db.User.findOne({ where: { email } })
  .then((user) => {
    if (user) {
      res.status(409).send({ error: 'User already exists' });
    } else {
      const newUser = db.User.build({
        firstname,
        lastname,
        email,
        password,
        role: 'user',
        isVerified: false,
        tokenemail,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(newUser, "newUser");

      newUser.save().then((user) => {
        const token = generateToken(user);
        res.status(201).send({ token });
      }).catch((error) => {
        console.error('Error while saving the user', error);
        res.status(500).send({ error: 'Error while saving the user' });
      });
    }
  })
  .catch((error) => {
    console.error('Error while checking if the user already exists', error);
    res.status(500).send({ error: 'Error while checking if the user already exists' });
  });
});

app.post('/verify', (req, res) => {
  const { tokenemail } = req.body;
 console.log(tokenemail, "tokenemail")
  db.User.findOne({ where: { tokenemail } })
  .then((user) => {
    if (user) {
      user.update({ isVerified: true }).then(() => {
        res.status(200).send({ message: 'User verified', status: 'success' });
      }).catch((error) => {
        console.error('Error while updating user', error);
        res.status(500).send({ error: 'Error while updating user' });
      });
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  })
  .catch((error) => {
    console.error('Error while checking if the user exists', error);
    res.status(500).send({ error: 'Error while checking if the user exists' });
  });
});



app.get('/me', (req, res) => {
  authenticateToken(req, res, () => {
    res.status(200).send({ message: 'Authenticated' }); 
  });

})

db.User.sync().then(() => {
  db.User.findOne({}).then((user) => {
    if (user) {
      console.log('Le modèle User existe déjà. Aucun nouvel utilisateur ne sera créé.');
    } else {
      const newUser = db.User.build({
        firstname: 'John',
        lastname: 'Doe',
        email: 'test@gmail.com',
        profilePicturePath: "defaultUser.png",
        password: 'Test1234*',
        role: 'admin',
        isVerified: true,
        tokenemail: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      newUser.save().then((user) => {
        console.log('Utilisateur enregistré avec succès', user);
      }).catch((error) => {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur', error);
      });
    }
  });
});

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connexion à MongoDB réussie');
  
    server.listen(3000, () => {
        console.log('Serveur Socket.IO en cours d\'exécution sur le port 3000');
    });
  
  
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB', error);
  });


  app.use('/api', apiRouter);
