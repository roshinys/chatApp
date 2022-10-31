const showPass = document.getElementsByClassName("fa-eye-slash")[0];
showPass.addEventListener("click", (e) => {
  const passreveal = e.target.previousElementSibling;
  if (passreveal.type == "password") {
    passreveal.type = "text";
  } else {
    passreveal.type = "password";
  }
});
