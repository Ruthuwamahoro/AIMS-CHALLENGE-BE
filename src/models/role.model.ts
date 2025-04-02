// create model for role only for admin and user
//use mongoose or mongodb
import mongoose, { Schema, Document } from "mongoose";

export enum RoleType {
  ADMIN = "admin",
  USER = "user",
}

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: Object.values(RoleType),
  },
  description: { type: String, required: true },
  permissions: { type: Array, required: true },
});

export interface IRole extends Document {
  name: RoleType;
  description: string;
  permissions: string[];
}

export const Role = mongoose.model<IRole>("Role", roleSchema);
