import mongoose, { Schema, type Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  prerequisites: string[];
  instructor: {
    name: string;
    bio: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  duration: { type: String, required: true },
  prerequisites: [{ type: String }],
  instructor: {
    name: { type: String, required: true },
    bio: { type: String },
    email: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)

