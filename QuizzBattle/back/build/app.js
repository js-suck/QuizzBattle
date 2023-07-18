"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const db_1 = require("./config/db");
const api_1 = require("./routers/api");
const user_1 = __importDefault(require("./models/user"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket établie');
    socket.on('message', (data) => {
        console.log('Message reçu :', data);
        io.emit('message', data); // Diffuser le message à tous les clients connectés
    });
    socket.on("roomFound", () => {
        console.log("roomFound");
        io.emit("roomFound");
    });
    socket.on('disconnect', () => {
        console.log('Déconnexion socket');
    });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
mongoose.connect(db_1.mongoURI)
    .then(() => {
        console.log('Connexion à MongoDB réussie');
        // Démarrer le serveur une fois la connexion établie
        // import user or crrate with mongoose
        const questionSchema = new mongoose.Schema({
            question: {
                type: String,
                required: true
            },
            options: [{
                type: String,
                required: true
            }],
            answer: {
                type: String,
                required: true
            }
        });
        const quizSchema = new mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            questions: [questionSchema]
        });
        const Quiz = mongoose.model('Quiz', quizSchema);
        user_1.default.exists({}).then((exists) => {
            if (exists) {
                console.log('Le schéma User existe déjà. Aucun nouvel utilisateur ne sera créé.', exists);
            } else {
                // Exemple d'utilisation : création d'un nouvel utilisateur
                const newUser = new user_1.default({
                    username: 'John Doe',
                    email: 'test@gmail.com',
                });
                newUser.save().then(user => {
                        console.log('Utilisateur enregistré avec succès', user);
                    })
                    .catch((error) => {
                        console.error('Erreur lors de l\'enregistrement de l\'utilisateur', error);
                    });
            }
        });
        Quiz.exists({})
            .then((exists) => {
                if (exists) {
                    console.log('Le schéma Quiz existe déjà. Aucun nouveau quiz ne sera créé.');
                } else {
                    // Exemple d'utilisation : création d'un nouveau quiz avec plusieurs questions
                    const newQuiz = new Quiz({
                        title: 'Quiz de géographie',
                        questions: [{
                                question: 'Quelle est la capitale de la France ?',
                                options: ['Paris', 'Londres', 'Berlin'],
                                answer: 'Paris'
                            },
                            {
                                question: 'Quel est le plus grand océan du monde ?',
                                options: ['Atlantique', 'Pacifique', 'Indien'],
                                answer: 'Pacifique'
                            },
                            {
                                question: 'Quel est le plus grand pays du monde ?',
                                options: ['Canada', 'Russie', 'Chine'],
                                answer: 'Russie'
                            },
                            {
                                question: 'Quel est le plus grand pays d\'Afrique ?',
                                options: ['Algérie', 'Soudan', 'Nigeria'],
                                answer: 'Algérie'
                            },
                        ]
                    });
                    newQuiz.save()
                        .then(() => {
                            console.log('Quiz enregistré avec succès');
                        })
                        .catch((error) => {
                            console.error('Erreur lors de l\'enregistrement du quiz', error);
                        });
                }
            });
        server.listen(3000, () => {
            console.log('Serveur Socket.IO en cours d\'exécution sur le port 3000');
        });
    })
    .catch((error) => {
        console.error('Erreur de connexion à MongoDB', error);
    });
app.use('/api', api_1.apiRouter);