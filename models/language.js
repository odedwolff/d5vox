var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LanguageSchema = new Schema(
  {
	 //applicaiton id (that is, also recognized by client, etc, as opposed to dtatbase id). 
	code: {type: String, required: true,  unique : true},
    dislpayName: {type: String, required: true},
	//todo-maybe we need a map for multiple speech engines 
    speechEngingCode: {type: String, required: true}
  }
);



module.exports = mongoose.model('Language', LanguageSchema);