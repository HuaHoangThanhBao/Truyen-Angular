const Utils = {

  addClass: function (element, theClass) {
      element.classList.add(theClass);
  },

  removeClass: function (element, theClass) {
      element.classList.remove(theClass);
  },

  showMore: function (element, excerpt) {
      element.addEventListener("click", event => {
          const linkText = event.target.textContent.trim().toLowerCase();
          const text = document.getElementById('expand-text');
          event.preventDefault();

          if (linkText == "xem thêm") {
              text.textContent = "Rút gọn";
              this.removeClass(excerpt, "excerpt-hidden");
              this.addClass(excerpt, "excerpt-visible");
          } else {
              text.textContent = "Xem thêm";
              this.removeClass(excerpt, "excerpt-visible");
              this.addClass(excerpt, "excerpt-hidden");
          }
      });
  }
};

const ExcerptWidget = {
  showMore: function (showMoreLinksTarget, excerptTarget) {
      const showMoreLinks = document.querySelectorAll(showMoreLinksTarget);

      showMoreLinks.forEach(function (link) {
          const excerpt = link.previousElementSibling.querySelector(excerptTarget);
          Utils.showMore(link, excerpt);
      });
  }
};
function expandBtn(){
  ExcerptWidget.showMore('.js-show-more', '.js-excerpt');

  /*Expand Chap*/
  const expand_chap = document.getElementById('expand-chap-cover');
  expand_chap.addEventListener('click', () => {
    var chap = document.getElementById('chapter-list');
    chap.style.maxHeight = "100%";

    expand_chap.parentNode.style.height = "0";
    expand_chap.parentNode.classList.add('active');
    expand_chap.style.display = "none";
  });
  /*End*/
}
