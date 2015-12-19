import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profilePhoto: { type: String },
  createdAt:    Date,
  updatedAt:    Date
});

userSchema.pre('save', function(next) {
  // Update timestamps!
  const currentDate = new Date();
  if ( this.isNew ) this.createdAt = currentDate;
  this.updatedAt = currentDate;

  return next();
});

const User = mongoose.model('User', userSchema)

export default User;
