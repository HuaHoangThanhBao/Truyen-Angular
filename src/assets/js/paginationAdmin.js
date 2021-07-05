/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

var Pagination = {
  code: "",
  listItem: [],

  // --------------------
  // Utility
  // --------------------

  // converting initialize data
  Extend: function (data, list) {
    data = data || {};
    Pagination.page = data.page || 1;
    Pagination.step = data.step || 3;
    Pagination.amount = data.amount || 10;
    Pagination.listItem = list;

    if (data.size % data.amount == 0) Pagination.size = ~~(data.size / data.amount);
    else Pagination.size = ~~(data.size / data.amount) + 1;
  },

  // add pages by number (from [s] to [f])
  Add: function (s, f) {
    for (var i = s; i < f; i++) {
      Pagination.code += "<a>" + i + "</a>";
    }
  },

  // add last page with separator
  Last: function () {
    Pagination.code += "<i>...</i><a>" + Pagination.size + "</a>";
  },

  // add first page with separator
  First: function () {
    Pagination.code += "<a>1</a><i>...</i>";
  },

  // --------------------
  // Handlers
  // --------------------

  // change page
  Click: function () {
    Pagination.page = +this.innerHTML;
    Pagination.ItemActived();
    Pagination.Start();
  },

  // previous page
  Prev: function () {
    Pagination.page--;
    if (Pagination.page < 1) {
      Pagination.page = 1;
    }
    Pagination.ItemActived();
    Pagination.Start();
  },

  // next page
  Next: function () {
    Pagination.page++;
    if (Pagination.page > Pagination.size) {
      Pagination.page = Pagination.size;
    }
    Pagination.ItemActived();
    Pagination.Start();
  },

  // --------------------
  // Script
  // --------------------

  //Enable & disable Item Component
  ItemActived: function () {
    for (let i = 0; i < Pagination.listItem.length; i++) {
      if (
        i >= (Pagination.page - 1) * Pagination.amount &&
        i < Pagination.page * Pagination.amount
      ) {
        Pagination.listItem[i].style.display = "block";
      } else {
        Pagination.listItem[i].style.display = "none";
      }
    }
  },

  // binding pages
  Bind: function () {
    var a = Pagination.e.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
      if (+a[i].innerHTML === Pagination.page) a[i].className = "current";
      a[i].addEventListener("click", Pagination.Click, false);
    }
  },

  // write pagination
  Finish: function () {
    Pagination.e.innerHTML = Pagination.code;
    Pagination.code = "";
    Pagination.Bind();
  },

  // find pagination type
  Start: function () {
    if (Pagination.size < Pagination.step * 2 + 6) {
      Pagination.Add(1, Pagination.size + 1);
    } else if (Pagination.page < Pagination.step * 2 + 1) {
      Pagination.Add(1, Pagination.step * 2 + 4);
      Pagination.Last();
    } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
      Pagination.First();
      Pagination.Add(
        Pagination.size - Pagination.step * 2 - 2,
        Pagination.size + 1
      );
    } else {
      Pagination.First();
      Pagination.Add(
        Pagination.page - Pagination.step,
        Pagination.page + Pagination.step + 1
      );
      Pagination.Last();
    }
    Pagination.Finish();
  },

  // --------------------
  // Initialization
  // --------------------

  // binding buttons
  Buttons: function (e) {
    var nav = e.getElementsByTagName("a");
    nav[0].addEventListener("click", Pagination.Prev, false);
    nav[1].addEventListener("click", Pagination.Next, false);
  },

  // create skeleton
  Create: function (e) {
    Pagination.ItemActived();

    var html = [
      "<a>&laquo;</a>", // previous button
      "<span></span>", // pagination container
      "<a>&raquo;</a>", // next button
    ];

    e.innerHTML = html.join("");
    Pagination.e = e.getElementsByTagName("span")[0];
    Pagination.Buttons(e);
  },

  // init
  Init: function (e, data, list) {
    Pagination.Extend(data, list);
    Pagination.Create(e);
    Pagination.Start();
  },
};

/* * * * * * * * * * * * * * * * *
 * Initialization
 * * * * * * * * * * * * * * * * */

var init = function () {
  const listItem = document.getElementsByClassName("item_ls");

//   const val = 21;
//   const divider = 11;
//   if (val % divider == 0) console.log(~~(val / divider));
//   else console.log(~~(val / divider) + 1);

  Pagination.Init(
    document.getElementById("pagination"),
    {
      size: listItem.length, // pages size
      page: 1, // selected page
      step: 3, // pages before and after current
      amount: 20, // amount of items per page
    },
    listItem
  );
};

document.addEventListener("DOMContentLoaded", init, false);
