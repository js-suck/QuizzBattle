import express from "express";
import http from 'http';
const { Server } = require("socket.io");
import mongoose = require('mongoose');
import { mongoURI } from './config/db'
import { apiRouter } from './routers/api';
import { authenticateToken, comparePasswords, generateToken } from "./services/authentifiactionService";
const db = require('./db');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cors = require('cors');

app.use(cors());
app.use(express.json())
io.on('connection', (socket: any) => {
  console.log('Nouvelle connexion socket établie');

  socket.on('message', (data: any) => {
    console.log('Message reçu :', data);
    io.emit('message', data); // Diffuser le message à tous les clients connectés
  });

  socket.on("startGame", () => {
    console.log("startGame");
    io.emit("startGame");
    });
  

  socket.on('disconnect', () => {
    console.log('Déconnexion socket');
  });
});
app.get('/', (req, res) => {
  res.send('Hello Wood!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.User.findOne({ where: { email } })
  .then((user) => {
    if (user) {
      // Check if password is correct (TODO: replace with comparePassword when encrypted registration is available)
      if (password.toString() === user.password) {
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
        username: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@gmail.com',
        password: '1234'
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
