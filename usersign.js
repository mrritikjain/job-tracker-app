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

  const userexist = users.find((user) => user.regemail === regemail);

  if (userexist) {
    alert("User already registered");
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(userimage.files[0]);

  reader.onload = function () {
    const userData = {
      username,
      regemail,
      image: reader.result,
    };
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", regemail);
    window.location.href = "dashboard.html";
  };
});

login.addEventListener("click", () => {
  const logemail = document.getElementById("logemail").value.trim();

  if (!logemail) {
    alert("Please enter email");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userexist = users.find((user) => user.regemail === logemail);

  if (!userexist) {
    alert("You are not registered. Please register first.");
  } else {
    localStorage.setItem("currentUser", logemail);
    window.location.href = "dashboard.html";
  }
});
