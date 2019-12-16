var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    user_name: {type: String, required: true, max: 100},
    hash_password: {type: String, required: true, max: 100},
	active_session_id: {type: String, required: false, max: 100}
  }
);


//Export model
module.exports = mongoose.model('User', UserSchema);