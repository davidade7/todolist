const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
	listName: {type: String, required: true},
	isArchived: {type: Boolean, default: false},
	tasks: []
});

const List = mongoose.model("List", ListSchema);

module.exports = List;