import mongoose, { Schema } from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
}

const userSchema = new Schema({
  username: { type: String, required: true },
});

export default mongoose.model<IUser>('User', userSchema);
