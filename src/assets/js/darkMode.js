function setUpDarkMode(){
  const btnSwitch = document.getElementById('theme-switch-btn');
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme) {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("darkTheme");
      document.documentElement.classList.remove("lightTheme");

      btnSwitch.parentElement.classList.remove('dark-mode');
      btnSwitch.parentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove("darkTheme");
      document.documentElement.classList.add("lightTheme");

      btnSwitch.parentElement.classList.add('dark-mode');
      btnSwitch.parentElement.classList.remove('light-mode');
    }
  }

  function switchTheme() {
    const currentTheme = document.documentElement.className;

    if(currentTheme == "lightTheme"){
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("darkTheme");
      document.documentElement.classList.remove("lightTheme");

      this.parentElement.classList.remove('dark-mode');
      this.parentElement.classList.add('light-mode');

    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("darkTheme");
      document.documentElement.classList.add("lightTheme");

      this.parentElement.classList.add('dark-mode');
      this.parentElement.classList.remove('light-mode');
    }
  }

  btnSwitch.addEventListener("click", switchTheme);
}
