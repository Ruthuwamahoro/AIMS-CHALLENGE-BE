import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  gender: string;
  telephone: string;
  password: string;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  gender: { type: String, required: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
});

userSchema.index({ username: 1, email: 1 }, { unique: true });
const User = mongoose.model<IUser>("User", userSchema);
export default User;
