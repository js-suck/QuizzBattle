// socket.js
import io from 'socket.io-client';

let socketInstance = null;

function createSocketInstance() {
  if (!socketInstance) {
    socketInstance = io('http://localhost:3000'); // Remplacez l'URL par celle de votre serveur
  }
  return socketInstance;
}

export default createSocketInstance();
