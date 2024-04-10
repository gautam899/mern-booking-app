import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Note when we are working with typescript we use small casing in the string and when we are working with the
// mongoose schema the s of the string is capital.

// Now we will be needing a schema that we will be using for the model.
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});


// The below is a middleware for mogodb that before saving it will check if the password is changed
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,8)
    }
    next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
