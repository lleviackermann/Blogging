import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (value: string []) {
          return Array.isArray(value) && value.length > 0; // Ensure at least one element
        },
        message: "there must be at least one image.",
      },
    },
    tags: {
      type: [String],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

carSchema.index({ title: 'text', description: "text", tags: "text" });

export default mongoose.model("Car", carSchema);
