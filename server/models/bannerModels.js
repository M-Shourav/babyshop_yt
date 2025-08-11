import mongoose from "mongoose";
import slugify from "slugify";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    subtitle: { type: String, unique: true, lower: true },
    image: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
