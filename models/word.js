var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WordSchema = new Schema({
	word: {type: String, required: true, max: 100},
	//TBD- change to reference
	language: {type: Schema.Types.ObjectId, ref: 'Language', required: false},
	weight: {type: Number},
	//each values is a string contiain 1 or more translations (porbably spereated by new line)
	transTextByLang: {
		type: Map,
		of: String
	},
	//a string holding one or more tags seperated by semicolons (?)
	tags: String
});


module.exports = mongoose.model('Word', WordSchema);