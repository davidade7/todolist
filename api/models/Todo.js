const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
	listName: {type: String, required: true},
	isArchived: {type: Boolean, default: false},
	tasks: []
});

const TaskSchema = new Schema({
	taskName: {type: String, required: true},
	isCompleted: {type: Boolean, default: false},
});

const List = mongoose.model("List", ListSchema);
const Task = mongoose.model("List", TaskSchema);

module.exports = {List, Task};