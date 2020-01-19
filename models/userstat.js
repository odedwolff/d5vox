var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserStatSchema = new Schema(
  {

	word:  {type: Schema.Types.ObjectId, ref: 'Author', required: true},
	userNameRef: {type:String},
	langCodeRef: {type:String},
	attemptsCount: {type: Number}, 
	correctCount: {type: Number},
	
  }
);



module.exports = mongoose.model('UserStat', UserStatSchema);