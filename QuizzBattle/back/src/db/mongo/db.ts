const mongoose = require('mongoose');
const { mongoURI } = require('./../../config/db');

export const initMongo = () => mongoose.connect(mongoURI)
  .then(() => { 
    console.log('Connexion à MongoDB réussie');
              }).catch((error) => {
    console.error('Erreur de connexion à MongoDB', error);
  });
