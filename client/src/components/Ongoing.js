import React, { useEffect, useState } from 'react'

/* import of styles and icons */
import './Ongoing.css'
import editIcon from '../assets/edit_icon.svg'
import deleteIcon from '../assets/delete_icon.svg'
import archiveIcon from '../assets/archive_icon.svg'
import addListIcon from '../assets/add_circle_icon.svg'
import sendIcon from '../assets/send_icon.svg'
import addTaskIcon from '../assets/add_circle_outline_icon.svg'


const api_base = "http://localhost:3001";

function Ongoing() {
  const [lists, setLists] = useState([]);
  const [addPopupActive, setAddPopupActive] = useState(false);
  const [contentName, setContentName] = useState("");
  const [listId, setListId] = useState("");
  const [action, setAction] = useState("");
  const [popUpTitle, setPopUpTitle] = useState("")
  
  useEffect(() => {
    GetLists();
  }, [])

  // get all unarchived lists
  const GetLists = () => {
    fetch(api_base + '/lists')
    .then(res => res.json())
    .then(data => setLists(data))
    .catch((err) => console.error("Erreur: ", err));
  }

  // delete a list
  const deleteList = async id => {
		const data = await fetch(api_base + '/list/delete/' + id, { method: "DELETE" }).then(res => res.json());

		setLists(lists => lists.filter(list => list._id !== data.result._id));
	}

  // add a list
  const setupCreateList = () => {
    setAction('add-list');
    setPopUpTitle("Creation d'une nouvelle liste");
    setAddPopupActive(true);
  }
  
  const addList = async () => {
		const data = await fetch(api_base + "/list/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				listName: contentName
			})
		}).then(res => res.json());

		setLists([...lists, data]);
		closePopUp();
	}

  // Archive a list
  const archiveList = async id => {
    await fetch(api_base + '/list/archive/' + id).then(res => res.json());
		GetLists()
	}

  // Rename a list
  const setupRename = (list_Name, list_Id) => {
    setContentName(list_Name);
    setListId(list_Id);
    setAction('rename-list');
    setPopUpTitle("Renommer la liste");
    setAddPopupActive(true);
  }
  const renameList = async () => {
    await fetch(api_base + "/list/update/" + listId, {
		 	method: "PUT",
		 	headers: {
		 		"Content-Type": "application/json" 
		 	},
		 	body: JSON.stringify({
		 		listName: contentName
		 	})
		 }).then(res => res.json());

     closePopUp();
     GetLists()
  }

  // add a task
  const setupAddTask = (list_Id) => {
    setAction('add-task');
    setPopUpTitle("Ajout d'une nouvelle tâche");
    setListId(list_Id);
    console.log(list_Id);
    setAddPopupActive(true);
  }
  const addTask = async () => {
    await fetch(api_base + "/list/"+ listId + "/addtask", {
 	 	method: "PUT",
 	 	headers: {
 	 		"Content-Type": "application/json" 
 	 	},
 	 	body: JSON.stringify({
 	 		taskName: contentName
 	 	})
 	}).then(res => res.json());
   closePopUp();
   GetLists()
  }

  // Close PopUp and reset data
  const closePopUp = () => {
    setAddPopupActive(false);
    setContentName("");
    setListId("");
    setAction("");
    setPopUpTitle("");
  }

  const validateForm = () => {
    switch (action) {
      case 'add-list':
        addList();
        break;
      case 'rename-list':
        renameList();
        break;
      case 'add-task':
        addTask();
        break;
      default:
        closePopUp()
    }
  }


  return (
    <div className="page-content">
      
      {lists.map(list => (
        <div className="list-card" key={list._id}>
          <div className="list-header">
            <div className="card-gauge">
              66%
            </div>
            <div className="card-content">
              <div className="card-title">
                <h2>{list.listName}</h2>
              </div>
              <div className="card-options">
                <div className="option tooltip" onClick={() => setupRename(list.listName, list._id)}>
                  <img src={editIcon} alt="Renommer la liste"></img>
                  <span className="tooltip-text">Renommer</span>
                </div>
                <div className="option tooltip" onClick={() => archiveList(list._id)}>
                  <img src={archiveIcon} alt="Archiver la liste"></img>
                  <span className="tooltip-text">Archiver</span>
                </div>
                <div className="option tooltip" onClick={() => deleteList(list._id)}>
                  <img src={deleteIcon} alt="Supprimer la liste"></img>
                  <span className="tooltip-text">Supprimer</span>
                </div>
              </div>
            </div>
          </div>
          <div className="list-footer">
            {/* tasks                      */}
            {list.tasks.map(task => (
              <div className="task" key={task._id}>
                <div className="task-left">
                  <div>
                    {task.isCompleted && <input type="checkbox" checked/>}
                    {!task.isCompleted && <input type="checkbox"/>}
                  </div>
                  <div className="task-content"> 
                    {task.taskName}
                  </div>
                </div>
                <div className="task-options">
                  <div className="option tooltip">
                    <img src={editIcon} alt="Renommer la liste"></img>
                    <span className="tooltip-text">Renommer</span>
                  </div>
                  <div className="option tooltip">
                    <img src={deleteIcon} alt="Supprimer la liste"></img>
                    <span className="tooltip-text">Supprimer</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="task-add" onClick={() => setupAddTask(list._id)}>
              <div>
                <img src={addTaskIcon} alt="Ajouter une tâche"></img>
              </div>
              <div className="task-content">
                Ajouter une tâche
              </div>
            </div>
          </div>
          
        </div>
      ))}

      {/* Add button */}
      <div className="add-list-button tooltip" onClick={() => setupCreateList()}>
        <img src={addListIcon} alt="Ajouter une liste" />
        <span className="tooltip-text">Nouvelle liste</span>
      </div>

      {/* Popup to add a list */}
      {addPopupActive ? (
				<div className="popup">
					<div className="popup-content">
						<div className="popup-header">
              <div className="popup-title">
                <h3>{popUpTitle}</h3>
              </div>
              <div className="popup-close popup-button" onClick={() => closePopUp()}>
                X
              </div>
            </div>
						<div className="popup-body">
              <div>
                <input type="text" className="add-todo-input" onChange={e => setContentName(e.target.value)} value={contentName} />
              </div>
              <div className="popup-button" onClick={() => validateForm()}>
                <img src={sendIcon} alt="Créer la liste" />
              </div>
            </div>
					</div>
				</div>
			) : ''}
    </div>
  )
}

export default Ongoing