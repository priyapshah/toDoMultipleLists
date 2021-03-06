//Links HTML
const allLists = document.querySelector('[taskLists]')
const formNewList = document.querySelector('[formNewList]')
const inputNewList = document.querySelector('[inputNewList]')
const deleteList = document.querySelector('[deleteList]')
const currList = document.querySelector('[currList]')
const listTitle = document.querySelector('[listTitle]')
const listCount = document.querySelector('[listCount]')
const currTasks = document.querySelector('[currTasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[newTaskForm]')
const newTaskInput = document.querySelector('[newTaskInput]')
const newDateInput = document.querySelector('[newDateInput')
const clearTasks = document.querySelector('[clearTasks]')

//Storage
const localStorageList = 'task.lists'
const localStorageListId = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(localStorageList)) || []
let selectedListId = localStorage.getItem(localStorageListId)

//Display Date
const dateDisplay = document.getElementById("date");
const options = {weekday: "long", month : "short", day : "numeric", year : "numeric"};
const today = new Date();
dateDisplay.innerHTML= today.toLocaleDateString("en-US", options)

//When window loads, load empty screen
window.onload = loadEmpty();

function loadEmpty() {
  selectedListId = null
  saveAndRender()
  
}

//Clicks a list
allLists.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

//Marks task as completed
currTasks.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

//Clears completed tasks
clearTasks.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

//Deletes the list
deleteList.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

//Adds a new list
formNewList.addEventListener('submit', e => {
  e.preventDefault()
  const listName = inputNewList.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  inputNewList.value = null
  lists.push(list)
  saveAndRender()
})

//Adds a new task
newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  const taskDate = newDateInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName, taskDate)
  newTaskInput.value = null
  newDateInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})



//Functions

//create list
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

//create task
function createTask(name, date) {
  return { id: Date.now().toString(), name: name, complete: false, date: date}
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(localStorageList, JSON.stringify(lists))
  localStorage.setItem(localStorageListId, selectedListId)
}

function render() {
  clearElement(allLists)
  renderLists()
  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    currList.style.display = 'none'
  } else {
    currList.style.display = ''
    listTitle.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(currTasks)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    if (task.date != "") {
    label.append(task.date.substring(5, 10) +": ")
    //label.style.fontWeight = "400";
    }
    label.append(task.name)
    currTasks.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "Task" : "Tasks"
  const tasksLeft = incompleteTaskCount <= 20 ? `${incompleteTaskCount}` : "a (Little More Than a) Few"
  listCount.innerText = `Only ${tasksLeft} More ${taskString} Left!`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    allLists.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()
