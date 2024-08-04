import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  emails: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('user', userSchema);
export default User;
