import express from 'express';

import GenericController from '../controllers/genericController';
import { EmoteService } from '../services/emoteService';

const stripe = require("stripe")('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');

const emoteServiceInstance = new EmoteService();
const emoteController = GenericController(emoteServiceInstance);
console.log(emoteServiceInstance)
const emoteRouter = express.Router();

function getByUserId(req, res) {
    emoteServiceInstance
        .findByUserId(req.params.userId)
        .then((emotes) => {
            res.json(emotes);
        })
        .catch((error) => {
            console.error(error);
        });
}


async function checkPayment(req, res) {
    const { session_id, user_id, emote_id } = req.query;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
  
      if (session.payment_status === 'paid') {
        // Payment was successful
            const emote = await emoteServiceInstance.addEmoteToUser(emote_id, user_id);

        return res.status(200).json({ success: true });
      } else {
        // Payment failed
        return res.status(200).json({ success: false });
      }
    } catch (error) {
      console.error('Error while verifying Stripe payment:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async function pay(req, res) {
    const {user_id, emote_id} = req.body
    try{

    const priceId = await emoteServiceInstance.getPriceByEmoteId(emote_id)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/emotes/pay/success?success=trues&session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}&emote_id=${emote_id}`,
      cancel_url:`http://localhost:5173/?success=false`,
    });
    
    res.json({url: session.url, session_id: session.id})}
    catch(error){
        res.send({error: error});
    }
  
  }
  

emoteRouter.post('/', emoteController.create);

emoteRouter.get('/:userId', getByUserId)

emoteRouter.post('/pay', pay);

emoteRouter.get('/pay/success', checkPayment);



export default emoteRouter;
