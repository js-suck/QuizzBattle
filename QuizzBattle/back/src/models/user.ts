import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true },
  scoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Score' }
});

const User = mongoose.model('User', userSchema);

export default User;