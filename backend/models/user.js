const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
      type: String,
      required: true,
  },
  graduation: {
    type: let, 
    required: false,
    trim: true,
    maxlength: 6 //MMYYYY
  },
  completedCourses: {
    type: Array (String), 
    required: true,
  }

});

const User = mongoose.model('User', userSchema);

module.exports = User;