import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const LikeSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
    postId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    }
  },
  { timestamps: true } 
);

LikeSchema.index({ postId: 1 });

export default model('Like', LikeSchema);
