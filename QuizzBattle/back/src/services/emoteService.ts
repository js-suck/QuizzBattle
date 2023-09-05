const Emotes = require("../db").Emote;
const User = require("../db").User;

export class EmoteService  {

  async findByUserId(userid) {
    const userIdString = userid.toString();
  
    const userEmotes =  await  Emotes.findAll({
      include: [{
        model: User,
        as: "users",
        attributes: [], 
        where: {
          id: userIdString,
        },
      }],
    })

    // create a array with id of Emote
    const userEmotesId = userEmotes.map((emote) => emote.id);

    const emotes = await Emotes.findAll({})

    return  {
      emotes,
      userEmotes: userEmotesId
      }
    };
  
    async create(data) {
      try {
       
        const emote = await Emotes.create(data);
        return emote;
      } catch (error) {
    
        throw error;
      }
    } 

    async addEmoteToUser(emoteId, userId) {
      try {



        const user = await User.findByPk(userId);
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        // Vérifier si l'utilisateur a déjà l'emote 
        const hasEmote = await Emotes.findOne({
            include: [{
                model: User,
                as: "users",
                where: {
                    id: userId,
                }
            }],
            where: {
                id: emoteId,
            }

        });

        if (hasEmote) {
          console.log('L\'utilisateur a déjà l\'emote');
          return;
        }

        const emote = await Emotes.findByPk(emoteId);
        if (!emote) {
          throw new Error('Emote non trouvé');
        }

        await user.addEmote(emote);
        console.log(emote.id, " added to user")

        return emote;
        
      } catch (error) {
          throw error;
      }
  }

  async getPriceByEmoteId(emoteId){
    const emote = await Emotes.findByPk(emoteId);

    if(!emote){
      throw new Error('Emote non trouvé');
    }


    return emote.price_id;
  }


    async findOne(id) {
      return await Emotes.findByPk(id);
    }
   
    async deleteOne(id) {
      const nbDeleted = await Emotes.destroy({ where: { id } });
      return nbDeleted === 1;
    }
  };  

