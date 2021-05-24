import mongoose from 'mongoose';
const schema = mongoose.Schema;

const userSchema = new schema({
  username: { type: String, required: true },
});

export default mongoose.model('User', userSchema);
