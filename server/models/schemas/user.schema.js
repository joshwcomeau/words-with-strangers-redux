import mongoose from 'mongoose';
import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';

import { createdAndUpdatedAt } from '../plugins';


const UserSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String },
  profilePhoto: { type: String }
});

UserSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare( password, this.password, callback);
};

UserSchema.plugin(createdAndUpdatedAt, { index: true });


UserSchema.pre('save', function(next) {
  if ( !this.isNew ) return next();

  // Encrypt the selected password!
  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    this.password = hashedPassword;
    return next();
  });

});

export default UserSchema;
