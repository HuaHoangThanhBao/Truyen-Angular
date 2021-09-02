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
  ExcerptWidget.showMore('.hero-o-content-show-more', '.hero-o-content-excerpt');

  /*Expand Chap*/
  const expand = document.getElementById('expand');
  const expandBtn = document.getElementById('expand-btn');
  const chap = document.getElementById('chapter-list');

  if(!expandBtn || !chap) return;

  expandBtn.addEventListener('click', () => {
    chap.classList.add('active');
    expand.classList.add('active');
  });
  /*End*/
}
