var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserStatSchema = new Schema(
  {

	srcWord:  {type: Schema.Types.ObjectId, ref: 'Word', required: true},
	userNameRef: {type:String},
	langCodeRef: {type:String},
	attemptsCount: {type: Number}, 
	correctCount: {type: Number},
	
  }
);



module.exports = mongoose.model('UserStat', UserStatSchema);