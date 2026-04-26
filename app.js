import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWpWesU14oPZXDiRLZY_38rc0T51cu-6Q",
  authDomain: "todo-list-ce81d.firebaseapp.com",
  projectId: "todo-list-ce81d",
  storageBucket: "todo-list-ce81d.firebasestorage.app",
  messagingSenderId: "668008172876",
  appId: "1:668008172876:web:7ed4df9e6aa292906693e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const todosCol = collection(db, "todos");

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

const q = query(todosCol, orderBy("createdAt"));
onSnapshot(q, (snapshot) => {
  todoList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const todo = docSnap.data();
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleDone(docSnap.id, checkbox.checked));

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteTodo(docSnap.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
});

window.addTodo = async function () {
  const text = todoInput.value.trim();
  if (!text) return;
  todoInput.value = "";
  await addDoc(todosCol, { text, done: false, createdAt: serverTimestamp() });
};

async function deleteTodo(id) {
  await deleteDoc(doc(db, "todos", id));
}

async function toggleDone(id, done) {
  await updateDoc(doc(db, "todos", id), { done });
}