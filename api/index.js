const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPwd = process.env.DB_PWD;
const uri = `mongodb+srv://${dbHost}:${dbPwd}@cluster0.qyqlp.mongodb.net/todosdb?retryWrites=true&w=majority`;

mongoose.connect(uri, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
})
  .then(() => console.log("PROJECT - Connected to MongoDB"))
  .catch(console.error);



if (process.env.NODE_ENV === "developement") {
  app.use("/", express.static(__dirname + "/"));
}


// ---------------------------
// Routes for list
const List = require('./models/List')

// get all lists not archived
app.get('/lists', async (req, res) => {
	const lists = await List.find({"isArchived": false});
	res.json(lists);
});

// get all archived lists
app.get('/archived-lists', async (req, res) => {
	const lists = await List.find({"isArchived": true});
	res.json(lists);
});

// create a new list
app.post('/list/new', (req, res) => {
	const list = new List({
		listName: req.body.listName
	})
	list.save();
	res.json(list);
});

// delete a list
app.delete('/list/delete/:id', async (req, res) => {
	const result = await List.findByIdAndDelete(req.params.id);
	res.json({result});
});

// Archive or not a list
app.get('/list/archive/:id', async (req, res) => {
	const list = await List.findById(req.params.id);
	list.isArchived = !list.isArchived;
	list.save();

	res.json(list);
})

// update list name
app.put('/list/update/:id', async (req, res) => {
	const list = await List.findById(req.params.id);
	list.listName = req.body.listName;
	list.save();

	res.json(list);
});

// ---------------------------
// Routes for task

// Get all tasks
// not needed as already in the list

// Create a new task
app.put('/list/:id/addtask', async (req, res) => {
	const list = await List.findById(req.params.id);
	list.tasks.push(
		{ taskName: req.body.taskName}
	)
	list.nbTask += 1;
	list.score = Math.floor(list.nbCompleted * 100 / list.nbTask);
	list.save();
	res.json(list);
});


// Delete a task
app.put('/list/:list_id/delete/:task_id', async (req, res) => {
	let completedIncrement = '';
	let completion ='';
	if (req.body.isCompleted) {
		completedIncrement = -1;
		completion = Math.floor((req.body.nbCompleted - 1) * 100 / (req.body.nbTask - 1));
	} else {
		completedIncrement = 0;
		completion = Math.floor((req.body.nbCompleted) * 100 / (req.body.nbTask - 1));
	}
	const list = await List.updateOne(
		{_id : req.params.list_id}, 
		{
		$pull : {"tasks": {_id: req.params.task_id}}, 
		$inc : {"nbTask": -1 , "nbCompleted": completedIncrement}, 
		$set : {"score": completion}
		});
	res.json(list);
});

// Rename a task
app.put('/list/:list_id/rename/:task_id', async (req, res) => {
	const list = await List.updateOne({_id : req.params.list_id, tasks : { $elemMatch : {_id : req.params.task_id }}}, 
		{$set : {"tasks.$.taskName": req.body.taskName}});
	res.json(list);
});

// Complete a task
app.put('/list/:list_id/complete/:task_id', async (req, res) => {
	let completedIncrement = '';
	let completion ='';
	if (req.body.isCompleted) {
		completedIncrement = 1;
		completion = Math.floor((req.body.nbCompleted + 1)*100/req.body.nbTask);
	} else {
		completedIncrement = -1;
		completion = Math.floor((req.body.nbCompleted - 1)*100/req.body.nbTask);
	}
	const list = await List.updateOne(
		{_id : req.params.list_id, tasks : { $elemMatch : {_id : req.params.task_id }}}, 
		{$set : {"tasks.$.isCompleted": req.body.isCompleted, "score": completion}, $inc : {"nbCompleted": completedIncrement }}
		);
	res.json(list);
});


if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.resolve(__dirname, "../client/build")));
   // Handle React routing, return all requests to React app  
	app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
	})
};
 
app.listen(PORT, () => console.info(`PROJECT - Server started on port ${PORT}`));
