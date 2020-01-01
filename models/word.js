var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WordSchema = new Schema({
	word: {type: String, required: true, max: 100},
	//TBD- change to reference
	language: {type: Schema.Types.ObjectId, ref: 'Language', required: false},
	weight: {type: Number},
	transTextByLang: {
		type: Map,
		of: String
	},
	tags: [String]
});


module.exports = mongoose.model('Word', WordSchema);