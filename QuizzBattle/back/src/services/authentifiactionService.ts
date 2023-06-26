 import jwt from 'jsonwebtoken';
 import bcrypt from 'bcrypt';
import { TUser } from '../types/user';


 const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname, 
      };
    
      const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
      return token;

 }

 async function comparePasswords(plainPassword : string, hashedPassword : string) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  }

  function authenticateToken(req, res, next) {
    console.log(
      'req.headers.authorization',
      req.headers.authorization
      );
    
    const token = req.headers.authorization?.split(' ')[1];
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, 'your-secret-key', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      console.log("ok")
      next();
    });
  }


  export { generateToken, comparePasswords, authenticateToken }