const toggleBtn = document.getElementById("nav_fixed-toggle");

const nav = document.getElementById("nav-sidebar-fixed");
const pages = document.getElementById("page-wrapper");

var count = 0;

toggleBtn.addEventListener("click", function () {
  count++;
  if (count % 2 != 0) {
    pages.classList.add("toggle");
    nav.classList.add("toggle");
  } else {
    pages.classList.remove("toggle");
    nav.classList.remove("toggle");
  }
});

const mega_sub_menu_btns = document.querySelectorAll(
  ".nav__bar-fixed-txt.dropdown"
);
const mega_menu_dropdown = document.getElementsByClassName(
  "mega-menu-dropdown"
);

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
