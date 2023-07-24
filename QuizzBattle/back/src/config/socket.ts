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
        console.log("socket: search a room")
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

        room.users.forEach(user => {
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
          console.log(roomID, "fetch user")
        const room = rooms.find((r) => r.id === roomID);
        if (room) {
            socket.join(room.id)
            io.to(room.id).emit('startGame', room);
        }
    } )

    socket.on("update score", ({user, room, score}) => {

      console.log("update score", room)

      const roomToUpdate = rooms.find((r) => r.id === room);
      if (roomToUpdate) {
        roomToUpdate.users.forEach((u) => {
          if (u.id === user.id) {
            u.score = score;
            return
          }
        });
      }
      io.to(room).emit('update score', roomToUpdate);

    })
});


return io;
}

export {
    initializeSocket
}