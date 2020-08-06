/// adicionar sound effect   /SFX

/// Casino effect

let images = [];
let imageCurrent = 0;
const imagesRemoved = [];

const shuffle = (array) => {
  let count = array.length,
    value,
    i;
  while (count) {
    i = Math.floor(Math.random() * count--);
    value = array[count];
    array[count] = array[i];
    array[i] = value;
  }

  return array;
};

const timeInterval = () => {
  let interval;
  return {
    cancel(callback) {
      if (typeof interval === "number") clearInterval(interval);
      callback && callback();
    },
    start(callback, time = 1000) {
      this.cancel();
      interval = setInterval(callback, time);
    },
  };
};

const loop = timeInterval();

const getImages = (file, callback) => {
  const reader = new FileReader();

  reader.addEventListener("load", (event) => {
    const dataUrl = event.target.result;

    images.push(dataUrl);
    callback && callback();
  });
  reader.readAsDataURL(file);
};

const imagePreview = document.getElementById("image__preview");
const imagesRemovedContainer = document.getElementById(
  "images-removed__contianer"
);
const buttonStop = document.getElementById("button__stop");
const buttonStart = document.getElementById("button__start");
const inputFile = document.querySelector("input[type=file]");

const disabledActionsButtons = () => {
  if (images.length) {
    buttonStop.disabled = true;
    buttonStart.disabled = false;
  } else {
    buttonStop.disabled = true;
    buttonStart.disabled = true;
  }
};
disabledActionsButtons(); //initial

inputFile.addEventListener("change", (event) => {
  const files = event.target.files;
  images = []; //reset ///temporario
  Array.from(files).forEach((file) =>
    getImages(file, () => {
      imagePreview.style.backgroundImage = `url(${images[0]})`;
      imagePreview.classList.add("z-depth-3");
      disabledActionsButtons();
    })
  );
});

buttonStart.addEventListener("click", (event) => {
  images = shuffle(images);
  const lenght = images.length - 1;
  let index = 0;

  imagePreview.classList.remove("selected");

  buttonStop.disabled = false;

  loop.start(() => {
    index = images[index] ? index : 0;
    imageCurrent = index;
    imagePreview.style.backgroundImage = `url(${images[index]})`;
    index += 1;
  }, 50);
});

buttonStop.addEventListener("click", (event) => {
  imagePreview.classList.add("selected");
  loop.cancel(() => {
    const imageRemoved = images.splice(imageCurrent, 1);
    imagesRemoved.push(imageRemoved[0]);

    imagesRemovedContainer.innerHTML = "";
    imagesRemoved.forEach((image) => {
      const imageElement = document.createElement("span");
      imageElement.style.backgroundImage = `url(${image})`;
      imagesRemovedContainer.insertBefore(
        imageElement,
        imagesRemovedContainer.firstChild
      );
    });

    disabledActionsButtons();
    event.target.disabled = true;
  });
});
