/* STATE */
const state = {
  dept: null,
  year: null,
  sem: null,
  user: null
};

/* FIREBASE CONFIG */
firebase.initializeApp({
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
});

const auth = firebase.auth();

/* AUTH STATE */
auth.onAuthStateChanged(user => {
  state.user = user;
  if (user) {
    document.getElementById("auth-modal").classList.add("hidden");
  }
});

/* AUTH EVENTS */
document.getElementById("login-btn").onclick = () => {
  document.getElementById("auth-modal").classList.remove("hidden");
};

document.getElementById("login-submit").onclick = () => {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  ).catch(e => authError.innerText = e.message);
};

document.getElementById("signup-submit").onclick = () => {
  auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  ).catch(e => authError.innerText = e.message);
};

/* NAVIGATION */
function show(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(view).classList.add("active");
}

document.getElementById("start").onclick = () => show("dept");

document.querySelectorAll(".dept-btn").forEach(btn => {
  btn.onclick = () => {
    state.dept = btn.dataset.dept;
    show("year");
  };
});

document.getElementById("next-year").onclick = () => {
  const y = document.querySelector("input[name=year]:checked");
  if (!y) return alert("Select year");
  state.year = y.value;
  show("sem");
};

document.getElementById("next-sem").onclick = () => {
  const s = document.querySelector("input[name=sem]:checked");
  if (!s) return alert("Select sem");
  state.sem = s.value;
  show("subjects");
  renderSubjects();
};

/* SUBJECT DATA */
const SUBJECTS = {
  "AIML|1|1": {
    "Math": "",
    "Physics": ""
  }
};

/* RENDER SUBJECTS */
function renderSubjects() {
  const grid = document.getElementById("subjects-grid");
  grid.innerHTML = "";

  const key = `${state.dept}|${state.year}|${state.sem}`;
  const subs = SUBJECTS[key];

  if (!subs) {
    grid.innerHTML = "No subjects available";
    return;
  }

  Object.entries(subs).forEach(([name, url]) => {
    const div = document.createElement("div");
    div.className = "subject-card";
    div.innerText = name;

    div.onclick = () => {
      if (!state.user) {
        document.getElementById("auth-modal").classList.remove("hidden");
        return;
      }

      if (!url) {
        alert("Content not uploaded yet");
        return;
      }

      alert("Open PDF here");
    };

    grid.appendChild(div);
  });
}