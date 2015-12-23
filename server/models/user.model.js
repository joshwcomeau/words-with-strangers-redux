import mongoose from 'mongoose';
import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';

import { setDatesOnSave } from './model_helpers';


const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profilePhoto: { type: String },
  createdAt:    Date,
  updatedAt:    Date
});

userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare( password, this.password, callback);
}

userSchema.pre('save', function(next) {
  setDatesOnSave.call(this);

  if ( this.isNew ) {
    // Encrypt the selected password!
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      this.password = hashedPassword;
      return next();
    });
  } else {
    return next();
  }
});

const User = mongoose.model('User', userSchema)

export default User;
