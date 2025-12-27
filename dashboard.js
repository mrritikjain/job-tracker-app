// ================= USERS =================
const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUserEmail = localStorage.getItem("currentUser");

if (!currentUserEmail) {
  window.location.href = "usersign.html";
}

const user = users.find((u) => u.regemail === currentUserEmail);
document.getElementById("welcome").innerText = `Welcome, ${user.username}!`;
document.getElementById("profileImg").src = user.image;

// ================= ELEMENTS =================
const addJob = document.getElementById("addjob");
const closeBtn = document.getElementById("close");
const form = document.querySelector(".listing-form");

const compName = document.getElementById("company-name");
const roleInput = document.getElementById("role");
const jobLocation = document.getElementById("job-location");
const compLogo = document.getElementById("company-logo");
const formSubmit = document.getElementById("form-submit");

const cardsContainer = document.querySelector(".job-cards");
const searchInput = document.getElementById("search-job");
const appliedbtn = document.getElementById("applied-btn");
const jobselection = document.getElementById("job-selection");
let debounceTimer;

// ================= JOB STORAGE =================
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// ================= FORM TOGGLE =================
addJob.onclick = () => (form.style.display = "flex");
closeBtn.onclick = () => (form.style.display = "none");

// ================= CREATE CARD =================
function createCard(job) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="logo">
      <img src="${job.logo}" height="50" width="50" />
    </div>
    <div class="job-details">
      <h2>${job.company}</h2>
      <h3>Role: <span>${job.role}</span></h3>
      <h5>Location: <span>${job.location}</span></h5>
    </div>
    <div class="status-btn">
      <button class="applied-btn">Applied</button>
    </div>
    <div class="update-bar">
      <select id="job-selection">
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
      </select>
      <img src="assets/delete.png" class="delete-card" height="20" />
    </div>
  `;

  cardsContainer.appendChild(card);
}

// ================= LOAD JOBS ON PAGE LOAD =================
function renderJobs() {
  cardsContainer.innerHTML = "";

  jobs
    .filter((job) => job.email === currentUserEmail)
    .forEach((job) => createCard(job));
}

renderJobs();

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
    };

    jobs.push(newJob);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    createCard(newJob);
    form.style.display = "none";

    // reset form
    compName.value = "";
    roleInput.value = "";
    jobLocation.value = "";
    compLogo.value = "";
  };

  reader.readAsDataURL(compLogo.files[0]);
});

// ================= DELETE JOB =================
cardsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-card")) {
    const card = e.target.closest(".card");
    const companyName = card.querySelector("h2").innerText;

    jobs = jobs.filter(
      (job) => !(job.company === companyName && job.email === currentUserEmail)
    );

    localStorage.setItem("jobs", JSON.stringify(jobs));
    card.remove();
  }
});

// ================= SEARCH WITH DEBOUNCE =================
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const value = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(value) ? "grid" : "none";
    });
  }, 300);
});

// ================= Filter Buttons =================

