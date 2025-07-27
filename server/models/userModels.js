import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dzblvh4ui/image/upload/v1753539125/images_pzrqga.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryman"],
      default: "user",
    },
    address: [],
    cart: [],
    wishList: [],
  },
  {
    timestamps: true,
  }
);

// compare password with enteredPassword
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
