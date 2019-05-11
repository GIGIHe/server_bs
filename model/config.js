var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database',{useNewUrlParser:true});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:fail'));
db.once('open',function() {
    console.log('connected success!')
})
module.exports = db