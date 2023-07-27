import mongoose from 'mongoose';
const gameSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    quizzName: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    quizzId: {
      type: Number,
      ref: 'Quiz',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
      date: {
      type: Date,
      default: Date.now
      },
      isWinner : {
          type: Boolean,
          default: false
      },
      isDraw : {
          type: Boolean,
          default: false
      },
      userVsID : {
          type: String,
          required: true
      }
  });

  export const Game = mongoose.model('Game', gameSchema);