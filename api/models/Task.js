const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	taskName: {type: String, required: true},
	isCompleted: {type: Boolean, default: false},
});

const Task = mongoose.model("List", TaskSchema);

module.exports = Task;