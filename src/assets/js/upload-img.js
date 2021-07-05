// Grabbing Elements and Storing in Variables
const defaultFile = document.getElementById("default-file");
const customBtn = document.getElementById("custom-btn");
const customSpace = document.getElementById("custom-space");
customBtn.addEventListener("click", function () {
  defaultFile.click();
});

// File Upload
defaultFile.addEventListener("change", function () {
  //  Format Selected File Text
  if (defaultFile.value) {
    customSpace.innerHTML =
      defaultFile.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
  } else {
    customSpace.innerHTML = "Chưa có file";
  }

  // Image Preview
  const files = defaultFile.files[0]; //files[0] - For getting first file
  //   console.log(files);

  if (files) {
    // Showing Image and Hiding "Image Preview" Text
    preview_img.style.display = "block";
    preview_text.style.display = "none";
    //Read File
    const fileReader = new FileReader();

    fileReader.addEventListener("load", function () {
      // convert image to base64 encoded string
      preview_img.setAttribute("src", this.result);
      //console.log(this.result);
    });
    fileReader.readAsDataURL(files);
  }
});