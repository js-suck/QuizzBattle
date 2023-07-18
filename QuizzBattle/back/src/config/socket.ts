import { createRoom } from "../services/authentifiactionService";

function initializeSocket(server)
{
const io =  require("socket.io")(server, {
    cors: {
      origin: "*",
    }
  })

  let rooms = [];
  const connectedSockets = [];
  function getConnectedSockets() {
    return connectedSockets;
  }

io.on('connection', (socket: any) => {
    console.log('Nouvelle connexion socket établie');
    connectedSockets.push(socket.id);
  
    socket.on('disconnect', () => {
      const index = connectedSockets.indexOf(socket.id);
      if (index !== -1) {
        connectedSockets.splice(index, 1);
      }
    });
  
    io.emit('userConnected', null);
  
    socket.on('message', (data: any) => {
      console.log('Message reçu :', data);
      io.emit('message', data); 
    });
  

  
  console.log(getConnectedSockets());
    socket.on('disconnect', () => {
      console.log('Déconnexion socket');
    });
  
  
    socket.on('search a room', (user) => {
        console.log("SEARCH")
      let room = null;
      for (let i=0 ;i<rooms.length; i++) {
        if (rooms[i].users.length === 1) 
        {
          room = rooms[i];
          break;
        }
      }
      if (!room){
        room = createRoom(user);
        rooms.push(room);
        socket.join(room.id);
      } else {

        room.users.array.forEach(user => {
          if (user.id === user.id) {
            return;
          }})

        room.users.push(user);
        socket.join(room.id);
        user.roomId = room.id;
    
        if (room.users.length === 2) {         
          io.to(room.id).emit('roomFound', room);
  
        } else {
          console.log("wait for other player")
        }
      }
  
  
    });


    socket.on("fetch room", (roomID: number) => {
        const room = rooms.find((r) => r.id === roomID);
        if (room) {
            socket.join(room.id)
            io.to(room.id).emit('startGame', room);
        }
    } )
});


return io;
}

export {
    initializeSocket
}