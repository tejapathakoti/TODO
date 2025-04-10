import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Task document
export interface ITask extends Document {
  title: string;
  _listId: mongoose.Types.ObjectId;
  completed: boolean;
  description: string;
}

// Define the Task schema
const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ""
  }
});

// Create the Task model using the schema
const Task = mongoose.model<ITask>("Task", TaskSchema);

export { Task };
