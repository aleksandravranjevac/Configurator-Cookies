let topDiv = document.querySelector(".raycaster.top");
let baseDiv = document.querySelector(".raycaster.base");
let leftArmDiv = document.querySelector(".raycaster.leftArm");
let rightArmDiv = document.querySelector(".raycaster.rightArm");

topDiv.addEventListener("click", () => {
  cookies.switchPart("top");
});
baseDiv.addEventListener("click", () => {
  cookies.switchPart("base");
});
leftArmDiv.addEventListener("click", () => {
  cookies.switchPart("leftArm");
});
rightArmDiv.addEventListener("click", () => {
  cookies.switchPart("rightArm");
});

function createAccessoryDivs(active) {
  let accessories = cookies.cactusData[cookies.activePart].find(
    (e) => e.name === active
  ).accessories;
  let accessoriesDiv = document.querySelector(
    ".option-container .accessory-options"
  );
  accessoriesDiv.innerHTML = "";

  // no accessory
  let option = document.createElement("div");
  option.classList.add("option");
  option.style.content = `url(../static/icons/x-icon.svg)`;
  accessoriesDiv.append(option);
  let accessoryName = document.querySelector(".option-container .option-name");
  accessoryName.innerHTML = "No Accessory";
  option.addEventListener("click", () => {
    activeAccessory = "EMPTY";

    cookies.switchAccessories(activeAccessory);
  });

  // have accessories
  let activeAccessory;
  if (accessories)
    accessories.forEach((acc) => {
      let option = document.createElement("div");
      option.classList.add("option");
      option.style.content = `url(../static/icons/${acc.icon})`;
      accessoriesDiv.append(option);

      option.addEventListener("click", () => {
        activeAccessory = acc.name;

        cookies.switchAccessories(activeAccessory);
      });
    });
}

let optionTitle = document.querySelector(".option-container h2");
let optionsDiv = document.querySelector(".option-container .options");
let optionsMenu = document.querySelector(".options-menu");

optionsMenu.addEventListener("click", () => {
  let activeOption;

  optionTitle.innerHTML = cookies.activePart;
  optionsDiv.innerHTML = "";

  cookies.cactusData[cookies.activePart].forEach((o) => {
    let option = document.createElement("div");
    option.classList.add("option");
    option.innerHTML = o.name;
    optionsDiv.append(option);

    option.addEventListener("click", (event) => {
      activeOption = o.name;
      createAccessoryDivs(activeOption);

      cookies.switchOptions(activeOption, cookies.activePart);
    });
  });
});
