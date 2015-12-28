import mongoose   from 'mongoose';

import UserSchema from './schemas/user.schema';


const User = mongoose.model('User', UserSchema)

export default User;
