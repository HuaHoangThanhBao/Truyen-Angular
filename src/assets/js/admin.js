function setUpAdmin() {
  const toggleBtn = document.getElementById("nav_fixed-toggle");

  const nav = document.getElementById("nav-sidebar-fixed");
  const pages = document.getElementById("page-wrapper");

  const mega_sub_menu_btns = document.querySelectorAll(
    ".nav__bar-fixed-txt.dropdown"
  );
  const mega_menu_dropdown = document.getElementsByClassName(
    "mega-menu-dropdown"
  );

  if (!toggleBtn || !nav || !pages || !mega_menu_dropdown || !mega_sub_menu_btns)
    return;

  var count = 0;

  toggleBtn.addEventListener("click", function () {
    count++;
    if (count % 2 != 0) {
      pages.classList.add("admin-nav-toggle");
      nav.classList.add("admin-nav-toggle");
    } else {
      pages.classList.remove("admin-nav-toggle");
      nav.classList.remove("admin-nav-toggle");
    }
  });

  var click = 0;

  for (let i = 0; i < mega_sub_menu_btns.length; i++) {
    mega_sub_menu_btns[i].addEventListener("click", function () {
      click++;
      if (click % 2 != 0) {
        mega_menu_dropdown[i].classList.add("enable");
      } else {
        mega_menu_dropdown[i].classList.remove("enable");
      }
    });
  }
}
