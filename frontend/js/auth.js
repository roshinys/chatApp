const showPass = document.getElementsByClassName("fa-eye-slash")[0];
const btn = document.getElementsByClassName("btn")[0];
const apiCall = "http://localhost:3000";

window.addEventListener("DOMContentLoaded", () => {
  showPass.addEventListener("click", showPassword);
  if (btn.name === "register") {
    btn.addEventListener("click", addNewUser);
  }
});

async function addNewUser(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const password = document.getElementById("password").value;
  if (!username || !email || !password || !phoneNumber) {
    Message("Inputs Required");
    return;
  }
  const response = await axios.post(`${apiCall}/user/new-user`, {
    username: username,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
  });
  if (!response.data.success) {
    Message(response.data.msg);
    return;
  }
  // console.log(response);
  Message(response.data.msg);
  setTimeout(() => {
    console.log("lets redirect");
  }, 1000);
}

function Message(msg) {
  const message = document.getElementsByClassName("message")[0];
  const messageBody = document.createElement("div");
  messageBody.className = "message-body";
  messageBody.innerHTML = `<h1 class="message-text">${msg}</h1>`;
  message.appendChild(messageBody);
  setTimeout(() => {
    messageBody.remove();
  }, 2000);
}

function showPassword(e) {
  const passreveal = e.target.previousElementSibling;
  if (passreveal.type == "password") {
    passreveal.type = "text";
  } else {
    passreveal.type = "password";
  }
}
