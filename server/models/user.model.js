import mongoose from 'mongoose';
import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profilePhoto: { type: String },
  createdAt:    Date,
  updatedAt:    Date
});

userSchema.methods.checkPassword = function(password, callback) {
  console.log("CONTEXT", this);
  bcrypt.compare( password, this.password, callback);
}

userSchema.pre('save', function(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;

  if ( this.isNew ) {
    this.createdAt = currentDate;

    // Encrypt the selected password!
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      this.password = hashedPassword;
      return next();
    });
  } else {
    return next();
  }




  return next();
});

const User = mongoose.model('User', userSchema)

export default User;
