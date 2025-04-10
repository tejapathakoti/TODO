import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the List document
export interface IList extends Document {
  title: string;
}

// Define the List schema
const ListSchema: Schema = new Schema<IList>({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

// Create the List model using the schema
const List = mongoose.model<IList>("List", ListSchema);

export { List };
