import { createRoom } from '../services/authentifiactionService';

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


  const findRoomByCategory = (category, id) => {
    return rooms[category]?.find((r) => r.id === id);
  }

io.on('connection', (socket: any) => {
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
  
  
    socket.on('search a room', ({user, category }) => {
      let room = null;
 
      if(rooms?.[category] !== undefined)
      {
      // search if a room with same category exist 
      rooms?.[category]?.forEach(r => {
        console.log(r.category, r.users)
        if (r.users.length === 1 && !r.users.find(u => u.id === user.id))
        {
          room = r;
        }
      })

    }

      if (!room){
        room = createRoom(user);
        console.log("create a room", room)

        // check if category exist or create 
        if (!rooms[category]) {
          rooms[category] = [];
        }

        rooms[category].push(room);
        socket.join(room.id);
      } else {

        console.log("room with user", room)
        room.users.forEach(user => {
          if (user.id === user.id) {
            return;
          }})
          console.log("ici..")

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


    socket.on("fetch room", ({room: roomId, category}) => {
     
        const room = rooms?.[category]?.find((r) => r.id === roomId);
        console.log("finded room:", room)
        if (room !== undefined) {
            socket.join(room.id)
            io.to(room.id).emit('startGame', room);
        } else {
              console.log("room not found")
        }
    } )

    socket.on("update score", ({ user, room, score, category }) => {
      console.log("update score", rooms[category]);
    
      // Recherche de la salle spécifique par son identifiant
      const roomToUpdate = rooms[category]?.find((r) => r?.id === room);
      // console.log(roomToUpdate, "room to update", user.id, roomToUpdate.users[0]);
    console.log("room to update", roomToUpdate)
      if (roomToUpdate) {

        const userToUpdate = roomToUpdate?.users?.find((u) => {
          return u.id === user.id
        });

        if (userToUpdate) { 
          console.log(userToUpdate)
          userToUpdate.score = score;
        }
        else{
          console.log("user not found")
        }

      }

      io.to(room).emit('update score', roomToUpdate);
    });
    
    socket.on("user finished", ({ user, room, category }) => {    
      const roomToUpdate = findRoomByCategory(category, room);
      if (roomToUpdate) {
        const userToUpdate = roomToUpdate.users?.find((u) => u.id === user.id);
        if (userToUpdate) {
          userToUpdate.finished = true;
        } else {
          console.log("user not found");
        }
      }
    
      const allFinished = roomToUpdate?.users?.every((u) => u.finished);
      if (allFinished) {
        io.to(roomToUpdate.id).emit('game finished', roomToUpdate);
    
        const indexToRemove = rooms[category].indexOf(roomToUpdate);
        if (indexToRemove !== -1) {
          rooms[category].splice(indexToRemove, 1);
          console.log("Salle supprimée :", roomToUpdate);
        } else {
          console.log("La salle n'a pas été trouvée dans le tableau");
        }
      }
    });
    


});



return io;
}

export { initializeSocket };