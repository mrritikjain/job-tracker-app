let register = document.getElementById("register");
let login = document.getElementById("login");

register.addEventListener("click", () => {
  const username = document.getElementById("name").value.trim();
  const regemail = document.getElementById("regemail").value.trim();
  const userimage = document.getElementById("userimage");

  if (!username || !regemail || userimage.files.length === 0) {
    alert("Please add Name, Email and Image");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userexist = users.find(user => user.email === regemail);

  if (userexist) {
    alert("User already registered");
    return;
  }

  users.push({
    name: username,
    email: regemail
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration successful");
});

login.addEventListener("click", () => {
  const logemail = document.getElementById("logemail").value.trim();

  if (!logemail) {
    alert("Please enter email");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userexist = users.find(user => user.email === logemail);

  if (!userexist) {
    alert("You are not registered. Please register first.");
  } else {
    alert(`Welcome ${userexist.name}`);
  }
});
