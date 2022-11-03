const token = localStorage.getItem("token");
const sendMessage = document.getElementById("sendMessage");
const contactHtml = document.querySelectorAll(".contact");
const addnewgroup = document.getElementById("addnewgroup");
var myInterval;
var oldmsgs;

window.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.href =
      "C:Users\roshiDesktop\backendSharpenerchatApp\frontendhtmllogin.html";
  }
  getAllChats();
  getAllGroups();
  sendMessage.addEventListener("click", sendNewText);
  addnewgroup.addEventListener("click", () => {
    const groupformhtml = document.getElementsByClassName("addGroupForm")[0];
    if (groupformhtml.classList.contains("active")) {
      groupformhtml.classList.remove("active");
    } else {
      groupformhtml.classList.add("active");
    }
  });
  document.getElementById("newgroup").addEventListener("click", AddNewGroup);
});

async function getAllGroups() {
  const response = await axios.get(
    "http://localhost:3000/group-chat/all-groups",
    {
      headers: { Authorization: token },
    }
  );
  // console.log(response);
  const groups = response.data.groups;
  groups.forEach((group) => {
    const chat = {
      id: group.id,
      username: group.name,
    };
    contactListNew(chat, true);
  });
  const contactListHtml = document.getElementsByClassName("contact-list")[0];
  for (let i = 0; i < contactListHtml.children.length; i++) {
    const gp = contactListHtml.children[i];
    if (gp.classList.contains("group")) {
      gp.addEventListener("click", specificGroup);
    }
  }
}

async function AddNewGroup(e) {
  e.preventDefault();
  const groupName = document.getElementById("groupName").value;
  if (!groupName) {
    console.log("group name required");
    return;
  }
  const response = await axios.post(
    "http://localhost:3000/group-chat/new-group",
    {
      groupName: groupName,
    },
    {
      headers: { Authorization: token },
    }
  );
  // console.log(response);
  const chat = {
    id: response.data.groupId,
    username: response.data.groupName,
  };
  contactListNew(chat, true);
}

async function sendNewText() {
  const newText = document.getElementById("newtext").value;
  document.getElementById("newtext").value = "";
  const profileUsername =
    document.getElementsByClassName("profile-username")[0];
  if (!profileUsername.id) {
    console.log("select chat");
    return;
  }
  let apiCall;
  let obj;
  if (profileUsername.classList.contains("group")) {
    const groudId = profileUsername.id;
    apiCall = "http://localhost:3000/group-chat/new-chat";
    obj = {
      id: groudId,
      content: newText,
    };
    console.log("am i here");
  } else {
    const OtherUserId = profileUsername.id;
    apiCall = "http://localhost:3000/chat/new-chat";
    obj = {
      id: OtherUserId,
      content: newText,
    };
  }
  const response = await axios.post(`${apiCall}`, obj, {
    headers: { Authorization: token },
  });
  console.log(response);
  addToChatList(response.data.result.content || newText, true);
}

function addToChatList(newText, isSent, username) {
  if (!username) {
    var username = "";
  }
  const texts = document.getElementsByClassName("texts")[0];
  // console.log(texts);
  const text = document.createElement("div");
  text.className = "text";
  if (isSent) {
    text.className = "text sent";
  }
  text.innerHTML = `<p><span class="text-username">${username}  </span>${newText}</p>`;
  texts.appendChild(text);
}

async function getAllChats() {
  const response = await axios.get("http://localhost:3000/chat/all-chats", {
    headers: { Authorization: token },
  });
  //   console.log(response);
  const chatList = response.data.allUser;
  addToContactList(chatList, false);
}

function addToContactList(chatList, isGroup) {
  //   console.log(chatList);
  const contactListHtml = document.getElementsByClassName("contact-list")[0];
  contactListHtml.innerHTML = "";
  chatList.forEach((chat) => {
    contactListNew(chat, isGroup);
  });
  for (let i = 0; i < contactListHtml.children.length; i++) {
    contactListHtml.children[i].addEventListener("click", specificUser);
  }
}

function contactListNew(chat, isGroup) {
  const contactListHtml = document.getElementsByClassName("contact-list")[0];
  const contact = document.createElement("div");
  contact.id = chat.id;
  // console.log(isGroup, contact.classList);
  contact.className = "contact";
  const newclass = isGroup ? "group" : "notGroup";
  contact.classList.add(newclass);
  contact.innerHTML = `<div class="contact-info">
      <img class="profileImg" src="../images/images.jpg" />
      <div class="text-info">
        <h3>${chat.username}</h3>
        <p>joined Chat</p>
      </div>
    </div>
    <p class="date">12:04am</p>`;
  contactListHtml.append(contact);
}

async function specificGroup(e) {
  let groupId = e.target.id;
  const texts = document.getElementsByClassName("texts")[0];
  texts.innerHTML = "";
  const response = await axios.get(
    `http://localhost:3000/group-chat/get-chat/${groupId}`,
    {
      headers: { Authorization: token },
    }
  );
  console.log("group chat of this ", response);
  groupId = response.data.group.id;
  let loggedUserId = response.data.loggedUserId;
  let groupName = response.data.group.name;
  const messages = response.data.groupMessages;
  const profileUsername =
    document.getElementsByClassName("profile-username")[0];
  profileUsername.id = groupId;
  profileUsername.innerText = groupName;
  profileUsername.classList.add("group");
  messages.forEach((message) => {
    let isSent = true;
    if (message.userId != loggedUserId) {
      isSent = false;
    }
    const content = message.content;
    addToChatList(content, isSent, message.user.username);
  });
}

async function specificUser(e) {
  if (myInterval) {
    clearInterval(myInterval);
  }
  let parent = e.target;
  let rid;
  rid = parent.id;
  const texts = document.getElementsByClassName("texts")[0];
  texts.innerHTML = "";
  let lastmsg = 0;
  // myInterval = setInterval(async () => {
  if (localStorage.getItem(rid)) {
    oldmsgs = JSON.parse(localStorage.getItem(rid));
    lastmsg = oldmsgs.length;
    addOldMsgs(oldmsgs);
  }
  let response;
  response = await axios.get(
    `http://localhost:3000/chat/user/${rid}?lastmsg=${lastmsg}`,
    {
      headers: { Authorization: token },
    }
  );
  // console.log(response);
  const userId = response.data.userId;
  const messages = response.data.allMessages;
  const OtherUser = response.data.otheruser;
  const profileUsername =
    document.getElementsByClassName("profile-username")[0];
  profileUsername.id = OtherUser.id;
  profileUsername.innerText = OtherUser.username;
  if (messages.length > 0) {
    display(messages, userId, rid);
  }
  // }, 1000);
}

function addOldMsgs(messages) {
  const texts = document.getElementsByClassName("texts")[0];
  texts.innerHTML = "";
  messages.forEach((message) => {
    const content = message[0];
    addToChatList(content, message[1]);
  });
}

function display(messages, userId, rid) {
  const newmsg = [];
  // const texts = document.getElementsByClassName("texts")[0];
  // texts.innerHTML = "";
  messages.forEach((message) => {
    let isSent = true;
    if (message.userId != userId) {
      isSent = false;
    }
    const content = message.content;
    newmsg.push([message.content, isSent]);
    addToChatList(content, isSent);
  });
  // // console.log(newmsg);
  // newmsg.forEach((msgs) => {
  //   console.log(msgs);
  // });
  if (!oldmsgs) {
    oldmsgs = [...newmsg];
  } else {
    oldmsgs = [...oldmsgs, ...newmsg];
  }
  localStorage.setItem(rid, JSON.stringify(oldmsgs));
}
