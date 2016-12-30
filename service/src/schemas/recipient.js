import mongoose from 'mongoose';

export default mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});
