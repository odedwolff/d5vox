var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LanguageSchema = new Schema(
  {
    dislpayName: {type: String, required: true},
    speechEngingCode: {type: String, required: true}
  }
);



module.exports = mongoose.model('Language', LanguageSchema);