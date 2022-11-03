const token = localStorage.getItem("token");
const sendMessage = document.getElementById("sendMessage");
const contactHtml = document.querySelectorAll(".contact");
var myInterval;
window.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.href =
      "C:Users\roshiDesktop\backendSharpenerchatApp\frontendhtmllogin.html";
  }
  getAllChats();
  sendMessage.addEventListener("click", sendNewText);
});

async function sendNewText() {
  const newText = document.getElementById("newtext").value;
  document.getElementById("newtext").value = "";
  const profileUsername =
    document.getElementsByClassName("profile-username")[0];
  if (!profileUsername.id) {
    console.log("select chat");
    return;
  }
  const OtherUserId = profileUsername.id;
  const response = await axios.post(
    "http://localhost:3000/chat/new-chat",
    {
      id: OtherUserId,
      content: newText,
    },
    {
      headers: { Authorization: token },
    }
  );
  // console.log(response);
  addToChatList(response.data.result.content || newText, true);
}

function addToChatList(newText, isSent) {
  const texts = document.getElementsByClassName("texts")[0];
  // console.log(texts);
  const text = document.createElement("div");
  text.className = "text";
  if (isSent) {
    text.className = "text sent";
  }
  text.innerHTML = `<p>${newText}</p>`;
  texts.appendChild(text);
}

async function getAllChats() {
  const response = await axios.get("http://localhost:3000/chat/all-chats", {
    headers: { Authorization: token },
  });
  //   console.log(response);
  const chatList = response.data.allUser;
  addToContactList(chatList);
}

function addToContactList(chatList) {
  //   console.log(chatList);
  const contactListHtml = document.getElementsByClassName("contact-list")[0];
  chatList.forEach((chat) => {
    const contact = document.createElement("div");
    contact.id = chat.id;
    contact.className = "contact";
    contact.innerHTML = `<div class="contact-info">
      <img class="profileImg" src="../images/images.jpg" />
      <div class="text-info">
        <h3>${chat.username}</h3>
        <p>joined Chat</p>
      </div>
    </div>
    <p class="date">12:04am</p>`;
    contactListHtml.append(contact);
  });
  for (let i = 0; i < contactListHtml.children.length; i++) {
    contactListHtml.children[i].addEventListener("click", specificUser);
  }
}
async function specificUser(e) {
  if (myInterval) {
    clearInterval(myInterval);
  }
  let parent = e.target;
  const rid = parent.id;
  myInterval = setInterval(async () => {
    let response;
    response = await axios.get(`http://localhost:3000/chat/user/${rid}`, {
      headers: { Authorization: token },
    });
    const user = response.data.user;
    const messages = response.data.allMessages;
    const OtherUser = response.data.Otheruser;
    const profileUsername =
      document.getElementsByClassName("profile-username")[0];
    profileUsername.id = OtherUser.id;
    profileUsername.innerText = OtherUser.username;
    display(messages, user);
  }, 1000);
}
// async function getUserChat(rid) {
//   let response;
//   response = await axios.get(`http://localhost:3000/chat/user/${rid}`, {
//     headers: { Authorization: token },
//   });
//   const user = response.data.user;
//   const messages = response.data.allMessages;
//   const OtherUser = response.data.Otheruser;
//   const profileUsername =
//     document.getElementsByClassName("profile-username")[0];
//   profileUsername.id = OtherUser.id;
//   profileUsername.innerText = OtherUser.username;
//   display(messages, user);
// }
function display(messages, user) {
  const texts = document.getElementsByClassName("texts")[0];
  texts.innerHTML = "";
  messages.forEach((message) => {
    let isSent = true;
    if (message.senderId != user.id) {
      isSent = false;
    }
    const content = message.content;
    addToChatList(content, isSent);
  });
}
