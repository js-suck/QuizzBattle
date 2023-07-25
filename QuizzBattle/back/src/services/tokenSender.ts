const Mailjet = require("node-mailjet");
const jwt = require('jsonwebtoken');

  const mailjetClient = new Mailjet({
    apiKey: "dfaaa1f406a6a163ed3cfd1c77387ae4",
    apiSecret: "4995cd8aca9ea391cf484eb41210994e",
  });
    
  const token = jwt.sign({
        data: 'Token Data'  .
    }, 'your-secret-key', { expiresIn: '10m' }  
);  

function sendVerificationEmail() {
    // Envoyer l'e-mail de vérification à l'utilisateur
    const request = mailjetClient.post("send", { version: "v3.1" }).request({
    Messages: [
        {
        From: {
            Email: "laila.charaoui@outlook.fr",
            Name: "The best",
        },
        To: [
            {
            Email: this.email,
            Name: `${this.firstname} ${this.lastname}`,
            },
        ],
        Subject: "Vérification de compte",
        HTMLPart: `<p>Bonjour ${
            this.firstname
        },</p><p>Veuillez cliquer sur le lien suivant pour vérifier votre compte : <a href="${generateVerificationLink(
            token
        )}">Vérifier mon compte</a></p>`,
        },
    ],
    });
    request
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err.statusCode);
    });
}
    

function generateVerificationLink(token) {
    // Générer le lien de vérification avec l'ID de l'utilisateur
    return `http://localhost:5173/verify/token=${token}`;
}



//     User.addHook("afterCreate", (user) => {
//     user.sendVerificationEmail();
//   });