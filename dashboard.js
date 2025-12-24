let users = JSON.parse(localStorage.getItem("users") || []);
let currentUserEmail = localStorage.getItem("currentUser");

if (!currentUserEmail) {
  window.location.href = "usersign.html";
}
const user = users.find((u) => u.regemail === currentUserEmail);

document.getElementById("welcome").innerText =
  "Welcome, " + user.username + "!";
document.getElementById("profileImg").src = user.image;
