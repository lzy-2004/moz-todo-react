import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";


function App(props) {

  const [tasks, setTasks] = useState([]);

  const [filter, setFilter] = useState("All");

  const [editCount, setEditCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/todo/all").then((res) => {
      return res.json();
    }).then((todos) => {
      setTasks(todos);
    })
  }, [editCount])

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  const FILTER_NAMES = Object.keys(FILTER_MAP);

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));


  function addTask(name) {
    fetch("http://localhost:8080/todo/add?name=" + name + "&isCompleted=false", { method: "post" }).then((res) => {
      console.log(res.text());
      setEditCount(editCount + 1);
    })
  }

  function deleteTask(id) {
    fetch("http://localhost:8080/todo/delete?id=" + id, { method: "post" }).then((res) => {
      console.log(res.text());
      setEditCount(editCount + 1);
    })
  }

  function toggleTaskCompleted(id) {
    fetch("http://localhost:8080/todo/changeComplete?id=" + id, { method: "post" }).then((res) => {
      console.log(res.text());
      setEditCount(editCount + 1);
    })
  }

  function editTask(id, newName) {
    fetch("http://localhost:8080/todo/edit?id=" + id + "&name=" + newName, { method: "post" }).then((res) => {
      console.log(res.text());
      setEditCount(editCount + 1);
    })
  }



  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));



  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;


  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}


export default App;
