/* import of react modules */
import React, { useEffect, useState } from 'react'

/* import of styles and icons */
import './Ongoing.css'
import editIcon from '../assets/edit_icon.svg'
import deleteIcon from '../assets/delete_icon.svg'
import archiveIcon from '../assets/archive_icon.svg'
import addListIcon from '../assets/add_circle_icon.svg'
import sendIcon from '../assets/send_icon.svg'
import addTaskIcon from '../assets/add_circle_outline_icon.svg'
import edit40pxIcon from '../assets/edit_40px_icon.svg'
import cancelIcon from '../assets/cancel_icon.svg'
import infoIcon from '../assets/info_icon.svg'

const api_base = "http://localhost:3001";

function Ongoing() {
  const [lists, setLists] = useState([]);
  const [addPopupActive, setAddPopupActive] = useState(false);
  const [contentName, setContentName] = useState("");
  const [listId, setListId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [action, setAction] = useState("");
  const [popUpTitle, setPopUpTitle] = useState("");
  const [popupError, setPopupError] = useState("");
  
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
    setPopUpTitle("Ajouter une liste");
    setAddPopupActive(true);
  }
  const addList = async () => {
		const addListUrl = `${api_base}/list/new`
    const data = await fetch(addListUrl, {
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
    const archiveUrl = `${api_base}/list/archive/${id}`
    await fetch(archiveUrl).then(res => res.json());
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
    setPopUpTitle("Ajouter une tâche");
    setListId(list_Id);
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

  // Delete a task
  const deleteTask = async(list_Id, task_Id, list_isCompleted, nbTask, nbCompleted) => {
    const deleteUrl = `${api_base}/list/${list_Id}/delete/${task_Id}`
    const taskStatut = list_isCompleted
    await fetch(deleteUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        isCompleted: taskStatut,
        nbTask : nbTask,
        nbCompleted: nbCompleted
      })
    }).then(res => res.json());
    GetLists()
  }
    
  // Rename a task
  const setupRenameTask = (list_Id, task_Id, list_Name) => {
    setListId(list_Id);
    setTaskId(task_Id);
    setContentName(list_Name);
    setAction('rename-task');
    setPopUpTitle("Renommer la tâche");
    setAddPopupActive(true);
  }
  const renameTask = async() => {
    await fetch(api_base + "/list/" + listId + "/rename/" + taskId, {
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

  // Complete a task
  const completeTask = async(list_Id, task_Id, task_isCompleted, nbTask, nbCompleted) => {
    const completeTaskUrl = `${api_base}/list/${list_Id}/complete/${task_Id}`;
    const taskStatut = task_isCompleted;
    await fetch(completeTaskUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        isCompleted: !taskStatut,
        nbTask : nbTask,
        nbCompleted: nbCompleted
      })
    }).then(res => res.json());
    GetLists()
  }


  // Close PopUp and reset data
  const closePopUp = () => {
    setAddPopupActive(false);
    setContentName("");
    setListId("");
    setTaskId("")
    setAction("");
    setPopUpTitle("");
    setPopupError("");
  }

  // Function to validate the form
  const validateForm = () => {
    if (contentName.length === 0) {
      if (action === 'add-list' || action === 'rename-list') {
        setPopupError("Le nom de la liste doit contenir au moins 1 caractères.")
      } else if (action === 'add-task' || action === 'rename-task') {
        setPopupError("Le nom de la tâche doit contenir au moins 1 caractères.")
      }
    } else if (contentName.length > 30) {
      if (action === 'add-list' || action === 'rename-list') {
        setPopupError("Le nom de la liste doit contenir au plus 30 caractères.")
      } else if (action === 'add-task' || action === 'rename-task') {
        setPopupError("Le nom de la tâche doit contenir au plus 30 caractères.")
      }
    } else {
      setPopupError('')
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
        case 'rename-task':
          renameTask();
          break;
        default:
          closePopUp()
      }
    }
  }


  return (
    <div className="page-content">
      {/* default message if no lists */}
      {lists.length===0 && <div className="default-message">
        <div>
          <img src={infoIcon} alt="Archiver la liste"></img>
        </div> 
        <div>
          <p>Il n'y a actuellement aucune liste.</p>
        </div>
      </div>}

      {/* ----- lists ----- */}
      {lists.map(list => (
        <div className="list-card" key={list._id}>
          <div className="list-header">
            <div className="card-gauge">
              {list.score}%
            </div>
            <div className="card-content">
              <div className="card-title">
                <h2>{list.listName}</h2>
              </div>
              <div className="options">
                <div className="option tooltip" onClick={() => setupRename(list.listName, list._id)}>
                  <img src={editIcon} alt="Renommer la liste"></img>
                  <span className="tooltip-text">Renommer ↓</span>
                </div>
                <div className="option tooltip" onClick={() => archiveList(list._id)}>
                  <img src={archiveIcon} alt="Archiver la liste"></img>
                  <span className="tooltip-text">Archiver ↓</span>
                </div>
                <div className="option tooltip" onClick={() => deleteList(list._id)}>
                  <img src={deleteIcon} alt="Supprimer la liste"></img>
                  <span className="tooltip-text">Supprimer ↓</span>
                </div>
              </div>
            </div>
          </div>
          <div className="list-footer">
            {/* ----- tasks ----- */}
            {list.tasks.map(task => (
              <div className="task" key={task._id}>
                <div className="task-left">
                  <div>
                    <input 
                      type="checkbox" 
                      checked={task.isCompleted ? true : false} 
                      onChange={() => completeTask(list._id, task._id, task.isCompleted, list.nbTask, list.nbCompleted)}
                    />
                  </div>
                  <div className="task-content"> 
                    {task.taskName}
                  </div>
                </div>
                <div className="options">
                  <div className="option tooltip" onClick={() => setupRenameTask(list._id, task._id, task.taskName)}>
                    <img src={editIcon} alt="Renommer la tâche"></img>
                    <span className="tooltip-text">Renommer ↓</span>
                  </div>
                  <div className="option tooltip" onClick={() => deleteTask(list._id, task._id, task.isCompleted, list.nbTask, list.nbCompleted)}>
                    <img src={deleteIcon} alt="Supprimer la tâche"></img>
                    <span className="tooltip-text">Supprimer ↓</span>
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
              <div className="popup-left">
                <div>
                  <img src={edit40pxIcon} alt="Renommer"></img>
                </div>
                <div className="popup-title"> 
                  <h3>{popUpTitle}</h3>
                </div>
              </div>
              <div className="popup-close" onClick={() => closePopUp()}>
                <div className="popup-button">
                  <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
                    <path d="M10.542 30.958 9.042 29.458 18.542 20 9.042 10.542 10.542 9.042 20 18.542 29.458 9.042 30.958  10.542 21.458 20 30.958 29.458 29.458 30.958 20 21.458Z"/>
                  </svg>
                </div>
              </div>
            </div>
						<div className="popup-body">
              <div>
                <input type="text" className="add-todo-input" onChange={e => setContentName(e.target.value)} value={contentName} />
                <p className="popup-restriction">(Min 1 caratère, max 30 caractères)</p>
                {popupError && <div className="popup-error">
                  <div>
                    <img src={cancelIcon} alt="stop"></img>
                  </div>
                  <div className="error-message">
                    {popupError}
                  </div>
                </div>}
              </div>
              <div className="popup-send" onClick={() => validateForm()}>
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