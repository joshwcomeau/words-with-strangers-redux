import mongoose from 'mongoose';
import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';

import {
  createdAndUpdatedAt,
  toJSON
}  from '../plugins';


const UserSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  twitterId:    { type: String },
  googleId:     { type: String },
  password:     { type: String },
  profilePhoto: { type: String }
});

UserSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare( password, this.password, callback);
};

UserSchema.plugin(createdAndUpdatedAt, { index: true });
UserSchema.plugin(toJSON);


UserSchema.pre('save', function(next) {
  if ( !this.isNew ) return next();

  // Encrypt the selected password!
  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    this.password = hashedPassword;
    return next();
  });

});

export default UserSchema;
