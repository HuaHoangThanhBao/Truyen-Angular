function carouselInit(){
  console.log("carousel inited");
  new Splide("#splide", {
    type: "loop",
    perPage: 5,
    perMove: 1,
    //height: "22rem",
    cover: true,
    drag: true,
    pagination: false,
    //lazyLoad: "nearby",
    padding: {
      left: 0,
      right: "1rem",
    },
    breakpoints: {
      1200: {
        perPage: 4,
      },
      860: {
        perPage: 3,
      },
      650: {
        perPage: 2,
      },
      520: {
        perPage: 2,
        //height: "28rem",
      },
    },
  }).mount();
}
