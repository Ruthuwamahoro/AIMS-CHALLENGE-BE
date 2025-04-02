import mongoose, { Schema, Document } from "mongoose";
import { RoleType } from "./role.model";

interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  gender: string;
  telephone: string;
  password: string;
  role: RoleType;
}

const userSchema = new Schema({
  fullName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // validate: {
    //   validator: function(v: string) {
    //     // Exactly 8 alphanumeric characters
    //     return /^[a-zA-Z0-9]{8}$/.test(v);
    //   },
    //   message: "Username must be exactly 8 alphanumeric characters"
    // }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter a valid email address"
    }
  },
  gender: { 
    type: String, 
    required: true,
    enum: ['male', 'female', 'other']
  },
  telephone: { 
    type: String, 
    required: true 
  },
  password: {
    type: String,
    required: true,
    // minlength: 8,
    // validate: {
    //   validator: function(v: string) {
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
    //   },
    //   message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    // }
  },
  role: {
    type: String,
    enum: Object.values(RoleType),
    default: RoleType.USER
  }
});

// Add index for login lookup optimization
userSchema.index({ email: 1, username: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;