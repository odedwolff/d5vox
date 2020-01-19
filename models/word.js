var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WordSchema = new Schema({
	word: {type: String, required: true, max: 100},
	languageCodeRef: {type: String, required: false},
	weight: {type: Number},
	transTextByLang: {
		type: Map,
		of: String
	},
	//a string holding one or more tags seperated by semicolons (?)
	tags: String
});


module.exports = mongoose.model('Word', WordSchema);