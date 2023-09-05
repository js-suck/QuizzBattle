import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname, 
        role: user.role,
        isVerified: user.isVerified,
      };
    
      const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
      return token;

 }

 async function comparePasswords(plainPassword : string, hashedPassword : string) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  }

  function authenticateToken(req, res, next) {

    console.log(req.path, "requested to the server")
    if (req.path === '/login') {
      return next();
    }
 
    const token = req.headers.authorization?.split(' ')[1];

    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, 'your-secret-key', (err, user) => {
      if (err) {
        console.log("ERROR TOKEN")

        return res.sendStatus(403);
      }
      req.user = user;
      req.isAdmin = user?.role == 'admin'
      next();
    });
  }

  function adminMiddleware(req, res, next) {
    const isAdmin = req.user && req.user.role === 'admin';
  
    if (isAdmin) {
      next();
    } else {
      res.sendStatus(404);
    }
  }
  

  function roomId() {

    return Math.random().toString(36).substr(2, 9);
  }

  function createRoom(user, category) {
    const room = { id: roomId(), users: [], category: category }; 
    room.users.push(user);
    user.roomId = room.id;
  
    return room;
  }
  

export {
  adminMiddleware,
  authenticateToken,
  comparePasswords,
  createRoom,
  generateToken,
};