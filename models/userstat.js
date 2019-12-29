var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserStatSchema = new Schema(
  {
	user:  {type: Schema.Types.ObjectId, ref: 'User', required: true},
	word:  {type: Schema.Types.ObjectId, ref: 'Author', required: true},
	attemptsCount: {type: Number}, 
	correctCount: {type: Number}
  }
);



module.exports = mongoose.model('UserStat', UserStatSchema);