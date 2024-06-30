import crypto from "crypto"
import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    activationCode: String,
    activationCodeExpire: Date
    
  },
  { timestamps: true }
);


userSchema.methods.generateActivation = function(){
  const code = crypto.randomBytes(10).toString('hex')
  this.activationCode = code

  let expiryDate = new Date();
  this.activationCodeExpire = expiryDate.setMinutes(
    expiryDate.getMinutes() + 10
  );

  return code
}

const User = model<IUser>("User", userSchema)

export default User