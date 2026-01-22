// ================= AUTH =================
const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUserEmail = localStorage.getItem("currentUser");

if (!currentUserEmail) location.href = "usersign.html";

const user = users.find(u => u.regemail === currentUserEmail);
if (!user) location.href = "usersign.html";

document.getElementById("welcome").innerText = `Welcome, ${user.username}`;
document.getElementById("profileImg").src = user.image;

// ================= STATE =================
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let currentFilter = "All";
let debounceTimer;

// ================= ELEMENTS =================
const cardsContainer = document.querySelector(".job-cards");
const form = document.querySelector(".listing-form");

const addJobBtn = document.getElementById("addjob");
const closeBtn = document.getElementById("close");
const formSubmit = document.getElementById("form-submit");

const compName = document.getElementById("company-name");
const roleInput = document.getElementById("role");
const jobLocation = document.getElementById("job-location");
const compLogo = document.getElementById("company-logo");
const searchInput = document.getElementById("search-job");

// Filters
const allBtn = document.getElementById("all-btn");
const appliedBtn = document.getElementById("applied-btn");
const interviewBtn = document.getElementById("interview-btn");
const rejectedBtn = document.getElementById("rejected-btn");

// ================= HELPERS =================
const saveJobs = () =>
  localStorage.setItem("jobs", JSON.stringify(jobs));

const getStatusClass = status =>
  status === "Interview" ? "interview-btn" :
  status === "Rejected" ? "rejected-btn" :
  "applied-btn";

// ================= COUNTS =================
function updateCounts() {
  const userJobs = jobs.filter(j => j.email === currentUserEmail);

  allBtn.innerText = `All (${userJobs.length})`;
  appliedBtn.innerText = `Applied (${userJobs.filter(j => j.status === "Applied").length})`;
  interviewBtn.innerText = `Interview (${userJobs.filter(j => j.status === "Interview").length})`;
  rejectedBtn.innerText = `Rejected (${userJobs.filter(j => j.status === "Rejected").length})`;
}

// ================= CARD =================
function createCard(job) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="logo">
      <img src="${job.logo}" width="50">
    </div>
    <div class="job-details">
      <h2>${job.company}</h2>
      <h3>Role: <span>${job.role}</span></h3>
      <h5>Location: <span>${job.location}</span></h5>
    </div>
    <div class="status-btn">
      <button class="${getStatusClass(job.status)} status-indicator-btn">
        ${job.status}
      </button>
    </div>
    <div class="update-bar">
      <select class="job-status-select">
        <option ${job.status==="Applied" && "selected"}>Applied</option>
        <option ${job.status==="Interview" && "selected"}>Interview</option>
        <option ${job.status==="Rejected" && "selected"}>Rejected</option>
      </select>
      <img src="assets/delete.png" class="delete-card" height="18">
    </div>
  `;

  // Status Change
  card.querySelector("select").onchange = e => {
    job.status = e.target.value;
    saveJobs();
    renderJobs();
  };

  // Delete
  card.querySelector(".delete-card").onclick = () => {
    jobs = jobs.filter(j => j !== job);
    saveJobs();
    renderJobs();
  };

  cardsContainer.appendChild(card);
}

// ================= RENDER =================
function renderJobs() {
  cardsContainer.innerHTML = "";
  updateCounts();

  const filtered = jobs
    .filter(j => j.email === currentUserEmail)
    .filter(j => currentFilter === "All" || j.status === currentFilter);

  if (!filtered.length) {
    cardsContainer.innerHTML = "<p>No jobs found</p>";
    return;
  }

  filtered.forEach(createCard);
}

renderJobs();

// ================= FILTERS =================
allBtn.onclick = () => { currentFilter = "All"; renderJobs(); };
appliedBtn.onclick = () => { currentFilter = "Applied"; renderJobs(); };
interviewBtn.onclick = () => { currentFilter = "Interview"; renderJobs(); };
rejectedBtn.onclick = () => { currentFilter = "Rejected"; renderJobs(); };

// ================= FORM =================
addJobBtn.onclick = () => form.style.display = "flex";
closeBtn.onclick = () => form.style.display = "none";

formSubmit.onclick = () => {
  if (!compName.value || !roleInput.value || !jobLocation.value || !compLogo.files.length) {
    alert("Fill all fields");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    jobs.push({
      email: currentUserEmail,
      company: compName.value,
      role: roleInput.value,
      location: jobLocation.value,
      logo: reader.result,
      status: "Applied"
    });

    saveJobs();
    renderJobs();
    form.style.display = "none";
    compName.value = roleInput.value = jobLocation.value = compLogo.value = "";
  };
  reader.readAsDataURL(compLogo.files[0]);
};

// ================= SEARCH (DEBOUNCE) =================
searchInput.oninput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const val = searchInput.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      card.style.display =
        card.innerText.toLowerCase().includes(val) ? "grid" : "none";
    });
  }, 300);
};
