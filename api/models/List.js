const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	taskName: {type: String, required: true},
	isCompleted: {type: Boolean, default: false},
});

const ListSchema = new Schema({
	listName: {type: String, required: true},
	isArchived: {type: Boolean, default: false},
	score: {type: Number, default: 0},
	tasks: [TaskSchema]
});

const List = mongoose.model("List", ListSchema);

module.exports = List;