let users = JSON.parse(localStorage.getItem("users") || []);
let currentUserEmail = localStorage.getItem("currentUser");
let addJob = document.getElementById("addjob");
let close = document.getElementById("close");
let compName = document.getElementById("company-name");
let Role = document.getElementById("role");
let compLogo = document.getElementById("company-logo");
let jobLocation = document.getElementById("job-location");
let formSubmit = document.getElementById("form-submit");
let cards = document.querySelector(".job-cards");
if (!currentUserEmail) {
  window.location.href = "usersign.html";
}
const user = users.find((u) => u.regemail === currentUserEmail);

document.getElementById("welcome").innerText =
  "Welcome, " + user.username + "!";
document.getElementById("profileImg").src = user.image;

addJob.addEventListener("click", () => {
  document.querySelector(".listing-form").style.display = "flex";
});

close.addEventListener("click", () => {
  document.querySelector(".listing-form").style.display = "none";
});

formSubmit.addEventListener("click", () => {
  if (!compName.value || !Role.value || !jobLocation.value || compLogo.files.lenght ===0) {
    alert("Please Fill all values.");
    return;
  }

  const reader = new FileReader();
  const card = document.createElement("div");
  card.classList.add("card");
  reader.onload = function () {
    card.innerHTML = `
 <div class="logo">
                <img
                  src="${reader.result}"
                  alt="Company Logo"
                  height="50px"
                  width="50px"
                />
              </div>
              <div class="job-details">
                <h2>${compName.value}</h2>
                <h3>Role : <span id="role">${Role.value}</span></h3>
                <h5>Location: <span id="location">${jobLocation.value}</span></h5>
              </div>
              <div class="status-btn">
                <span id="card-btn" class="applied-btn">Applied</span>
              </div>
              <div class="update-bar">
                <select name="status" id="job-status">
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                </select>

                <img
                  src="assets/delete.png"
                  alt="delete icon"
                  height="20px"
                  width="20px"
                  id="delete-card"
                />
              </div>
 `;
  };
  reader.readAsDataURL(compLogo.files[0]);
  cards.appendChild(card);
  document.querySelector(".listing-form").style.display = "none";
  card.style.display = "grid";
});

document.querySelector(".main").addEventListener("click", (e) => {
  if (e.target.id === "delete-card") {
    e.target.closest(".card").remove();
  }
});
