// ================= USERS & AUTH =================
const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUserEmail = localStorage.getItem("currentUser");

if (!currentUserEmail) {
  window.location.href = "usersign.html";
}

const user = users.find((u) => u.regemail === currentUserEmail);

if (user) {
  document.getElementById("welcome").innerText = `Welcome, ${user.username}!`;
  document.getElementById("profileImg").src = user.image;
} else {
  window.location.href = "usersign.html";
}

// ================= ELEMENTS =================
const addJobBtn = document.getElementById("addjob");
const closeBtn = document.getElementById("close");
const form = document.querySelector(".listing-form");

const compName = document.getElementById("company-name");
const roleInput = document.getElementById("role");
const jobLocation = document.getElementById("job-location");
const compLogo = document.getElementById("company-logo");
const formSubmit = document.getElementById("form-submit");

const cardsContainer = document.querySelector(".job-cards");
const searchInput = document.getElementById("search-job");

// Filter Buttons
const allBtn = document.getElementById("all-btn");
const appliedFilterBtn = document.getElementById("applied-btn");
const interviewFilterBtn = document.getElementById("interview-btn");
const rejectedFilterBtn = document.getElementById("rejected-btn");

let debounceTimer;

// ================= JOB STORAGE =================
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// ================= FORM TOGGLE =================
addJobBtn.onclick = () => (form.style.display = "flex");
closeBtn.onclick = () => (form.style.display = "none");

// ================= HELPER: SAVE TO LOCAL STORAGE =================
function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

// ================= HELPER: GET CSS CLASS FOR STATUS =================
function getStatusClass(status) {
  switch (status) {
    case "Interview":
      return "interview-btn";
    case "Rejected":
      return "rejected-btn";
    case "Applied":
    default:
      return "applied-btn";
  }
}

// ================= HELPER: UPDATE COUNTS =================
function updateCounts() {
  // Filter jobs for current user only
  const userJobs = jobs.filter((job) => job.email === currentUserEmail);

  const total = userJobs.length;
  const applied = userJobs.filter((j) => j.status === "Applied").length;
  const interview = userJobs.filter((j) => j.status === "Interview").length;
  const rejected = userJobs.filter((j) => j.status === "Rejected").length;

  allBtn.innerText = `All (${total})`;
  appliedFilterBtn.innerText = `Applied (${applied})`;
  interviewFilterBtn.innerText = `Interview (${interview})`;
  rejectedFilterBtn.innerText = `Rejected (${rejected})`;
}

// ================= CREATE CARD =================
function createCard(job) {
  const card = document.createElement("div");
  card.className = "card";

  const statusClass = getStatusClass(job.status || "Applied");

  card.innerHTML = `
    <div class="logo">
      <img src="${job.logo}" height="50" width="50" alt="logo" />
    </div>
    <div class="job-details">
      <h2>${job.company}</h2>
      <h3>Role: <span>${job.role}</span></h3>
      <h5>Location: <span>${job.location}</span></h5>
    </div>
    <div class="status-btn">
      <button class="${statusClass} status-indicator-btn">${
    job.status || "Applied"
  }</button>
    </div>
    <div class="update-bar">
      <select class="job-status-select">
        <option value="Applied" ${
          job.status === "Applied" ? "selected" : ""
        }>Applied</option>
        <option value="Interview" ${
          job.status === "Interview" ? "selected" : ""
        }>Interview</option>
        <option value="Rejected" ${
          job.status === "Rejected" ? "selected" : ""
        }>Rejected</option>
      </select>
      <img src="assets/delete.png" class="delete-card" height="20" alt="delete" />
    </div>
  `;

  // Attach Event Listener for Status Change
  const selectElement = card.querySelector(".job-status-select");
  const statusBtn = card.querySelector(".status-indicator-btn");

  selectElement.addEventListener("change", (e) => {
    const newStatus = e.target.value;
    job.status = newStatus;
    saveJobs();

    // Update the button inside the card immediately
    statusBtn.className = `${getStatusClass(newStatus)} status-indicator-btn`;
    statusBtn.innerText = newStatus;

    // Update counts on top
    updateCounts();
    
    // Refresh list if we are currently filtering by a specific status
    if (currentFilter !== "All" && currentFilter !== newStatus) {
       renderJobs();
    }
  });

  // Attach Event Listener for Delete
  const deleteBtn = card.querySelector(".delete-card");
  deleteBtn.addEventListener("click", () => {
    const index = jobs.indexOf(job);
    if (index > -1) {
      jobs.splice(index, 1);
      saveJobs();
      renderJobs(); // Will Re-render and also update counts via renderJobs calls
    }
  });

  cardsContainer.appendChild(card);
}

// ================= LOAD JOBS / RENDER =================
let currentFilter = "All";

function renderJobs() {
  cardsContainer.innerHTML = "";
  
  // Always update counts when rendering
  updateCounts();

  const userJobs = jobs.filter((job) => job.email === currentUserEmail);

  const filteredJobs = userJobs.filter((job) => {
    if (currentFilter === "All") return true;
    return job.status === currentFilter;
  });

  if (filteredJobs.length === 0) {
    cardsContainer.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  filteredJobs.forEach((job) => createCard(job));
}

// Initial Render
renderJobs();

// ================= FILTERS =================
allBtn.onclick = () => {
  currentFilter = "All";
  renderJobs();
};
appliedFilterBtn.onclick = () => {
  currentFilter = "Applied";
  renderJobs();
};
interviewFilterBtn.onclick = () => {
  currentFilter = "Interview";
  renderJobs();
};
rejectedFilterBtn.onclick = () => {
  currentFilter = "Rejected";
  renderJobs();
};

// ================= ADD JOB =================
formSubmit.addEventListener("click", () => {
  if (
    !compName.value.trim() ||
    !roleInput.value.trim() ||
    !jobLocation.value.trim() ||
    compLogo.files.length === 0
  ) {
    alert("Please fill all fields");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const newJob = {
      email: currentUserEmail,
      company: compName.value.trim(),
      role: roleInput.value.trim(),
      location: jobLocation.value.trim(),
      logo: reader.result,
      status: "Applied", // Default status
    };

    jobs.push(newJob);
    saveJobs();

    renderJobs();
    form.style.display = "none";

    // reset form
    compName.value = "";
    roleInput.value = "";
    jobLocation.value = "";
    compLogo.value = "";
  };

  reader.readAsDataURL(compLogo.files[0]);
});

// ================= SEARCH WITH DEBOUNCE =================
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const value = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const company = card.querySelector("h2").innerText.toLowerCase();
      const role = card.querySelector("h3 span").innerText.toLowerCase();
      
      const match = company.includes(value) || role.includes(value);
      card.style.display = match ? "grid" : "none";
    });
  }, 300);
});
