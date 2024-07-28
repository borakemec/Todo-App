const mainCont = document.querySelector('.main-container');
const projectTitleCont = document.querySelector('.project-names');
const addProjectButton = document.querySelector('.add-project');
const addProjectInput = document.querySelector('.project-textbox');
const addTodoTitle = document.querySelector('.add-todo-title-input');
const addTodoDesc = document.querySelector('.add-todo-desc-input');
const addTodoDue = document.querySelector('.add-todo-due-input');
const addTodoPrio = document.querySelector('.add-todo-prio-input');
const addTodoDone = document.querySelector('.add-todo-done-input');
const addTodoSubmit = document.querySelector('.add-todo-submit');
const todoForm = document.querySelector('.form-container');
const closeForm = document.querySelector('.close-button');
let currentProject;
let projectsArray = [];

class Todo {
    constructor(title, description, dueDate, priority, isDone = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isDone = isDone;
    }

    changeStatus() {
        this.isDone = !this.isDone;
    }
}

class Project {
    constructor(title, todos) {
        this.title = title;
        this.todos = todos;
        projectsArray.push(this);
        addProjectTitles();
        localStorage.setItem('projectsArray', JSON.stringify(projectsArray));
    }

    addTodo(todo) {
        this.todos.push(todo);
        showProject(this);
    }

    removeTodo(todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
    }

    renameProject(newname) {
        if(newname.trim().length > 0) {
            this.title = newname.trim();
            addProjectTitles();
            showProject(this);
        }
    }

    removeProject() {
        removeProject(this);
    }
}

function removeProject(project) {
    if(projectsArray.length > 1){
        if(projectsArray.indexOf(project) > 0){
            let nextProject = projectsArray[projectsArray.indexOf(project)-1];
            showProject(nextProject);
        }
        else {
            let nextProject = projectsArray[projectsArray.indexOf(project)+1];
            showProject(nextProject);
        }
    }
    else {
        mainCont.innerHTML = '';
    }
    projectsArray.splice(projectsArray.indexOf(project), 1);
    localStorage.setItem('projectsArray', JSON.stringify(projectsArray));
    addProjectTitles();
}

function showProject(project) {
    mainCont.innerHTML = '';

    const projectTitle = document.createElement('h2');
    projectTitle.classList.add('project-title');
    projectTitle.innerText = project.title;
    mainCont.appendChild(projectTitle);

    const renameProjectButton = document.createElement('div');
    renameProjectButton.classList.add('rename-project');
    renameProjectButton.innerText = 'Rename';
    renameProjectButton.addEventListener('click', () => project.renameProject(renameProjectInput.value));
    mainCont.appendChild(renameProjectButton);

    const renameProjectInput = document.createElement('input');
    renameProjectInput.classList.add('rename-project-input');
    renameProjectInput.setAttribute('type', 'text');
    mainCont.appendChild(renameProjectInput);

    const addTodoButton = document.createElement('div');
    addTodoButton.classList.add('add-todo-button');
    addTodoButton.innerText = 'Add';
    addTodoButton.addEventListener('click', () => {todoForm.style.display = 'flex'});

    mainCont.appendChild(addTodoButton);

    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-container');
    mainCont.appendChild(todoContainer);

    addTodoBoxes(project, todoContainer);
    currentProject = project;

    localStorage.setItem('projectsArray', JSON.stringify(projectsArray));
}

function addTodoBoxes(project, cont) {
    for(let i = 0; i < project.todos.length; i++) {
        const todo = project.todos[i];
        const todoBox = document.createElement('div');
        todoBox.classList.add('todo-box');
        todoBox.innerHTML = `${todo.title}<span class="todo-desc">${todo.description}</span>
                            <span class="todo-due">${todo.dueDate}</span>`;

        if(todo.priority === "1") {
            todoBox.classList.add("prio1");
        }
        else if(todo.priority === "2") {
            todoBox.classList.add("prio2");
        }
        else {
            todoBox.classList.add("prio3");
        }

        if(todo.isDone) {
            todoBox.classList.add("todo-done");
        }

        cont.appendChild(todoBox);
    }
}

function addProjectTitles() {

    projectTitleCont.innerHTML = '';

    if(projectsArray.length > 0) {
        for(let i= 0; i < projectsArray.length; i++) {

            const projectTitleDiv = document.createElement('div');
            projectTitleDiv.classList.add('project-title-left-div');

            const projectTitle = document.createElement('p');
            projectTitle.classList.add('project-title-left');
            projectTitle.innerText = projectsArray[i].title;
            projectTitle.addEventListener('click', () => showProject(projectsArray[i]));

            const deleteProjectButton = document.createElement('div');
            deleteProjectButton.classList.add('delete-project');
            deleteProjectButton.innerText = 'Remove';
            deleteProjectButton.addEventListener('click', () => projectsArray[i].removeProject());

            projectTitleDiv.appendChild(projectTitle);
            projectTitleDiv.appendChild(deleteProjectButton);
            projectTitleCont.appendChild(projectTitleDiv);
        }
    }
}

function addTodoToProject(project) {
    if(addTodoTitle.value.trim().length > 0 && addTodoDue.value.trim().length > 0 && addTodoPrio.value.trim().length > 0) {
        project.addTodo(new Todo(addTodoTitle.value.trim(), addTodoDesc.value.trim(), addTodoDue.value, addTodoPrio.value, addTodoDone.checked));
        console.log(addTodoDone.checked);
        addTodoTitle.value = '';
        addTodoDue.value = '';
        addTodoPrio.value = '';
        addTodoDesc.value = '';
        todoForm.style.display = 'none';
    }
    else {
        alert("Please fill title, due date and priority.");
    }
}

function initPage() {
    const storedProjects = localStorage.getItem('projectsArray');

    if (storedProjects === null) {
        const firstProject = new Project('First', []);

        const todoOne = new Todo('Bir', 'Aciklama', '07/25/2024', '2', false);
        const todoTwo = new Todo('Iki', 'Aciklama iki', '07/20/2024', '3', false);
        const todoThree = new Todo('Uc', 'Aciklama Uc', '08/11/2024', '1', true);

        firstProject.addTodo(todoOne);
        firstProject.addTodo(todoTwo);
        firstProject.addTodo(todoThree);

        showProject(firstProject);
    } else {
        const parsedProjects = JSON.parse(storedProjects);
        projectsArray = parsedProjects.map(projectData => {
            const todos = projectData.todos.map(todoData => new Todo(
                todoData.title,
                todoData.description,
                todoData.dueDate,
                todoData.priority,
                todoData.isDone
            ));

            return new Project(projectData.title, todos);
        });

        if (projectsArray.length > 0) {
            showProject(projectsArray[0]);
        }
    }
}


initPage();

addProjectButton.addEventListener('click', function() {if(addProjectInput.value.trim().length > 0) {new Project(addProjectInput.value.trim(), []);addProjectInput.value = '';}});
addTodoSubmit.addEventListener('click', () => addTodoToProject(currentProject));
closeForm.addEventListener('click', () => {todoForm.style.display = 'none';});
