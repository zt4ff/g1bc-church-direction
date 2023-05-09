let churchData;
const searchInput = document.querySelector("#search");
const optionList = document.querySelector(".church-list");
const churchInfoBoard = document.querySelector("#church-info")

async function main() {
  churchData = await (await fetch("./church-info.json")).json();
  optionList.innerHTML = createListItem(churchData);

  const debouncedSearch = debounce(fuzzySearch, 500);

  searchInput.addEventListener("input", async (e) => {
    try {
      const data = await debouncedSearch(e.target.value, churchData);
      optionList.innerHTML = createListItem(data);
    } catch (err) {
      console.log(err.message);
    }
  });
}

main();

function fuzzySearch(inp, arr) {
  return arr.filter((x) => {
    const inputRegex = RegExp(inp, "i");
    return inputRegex.test(x.name) || inputRegex.test(x.fullname);
  });
}

function debounce(callback, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(callback.apply(this, args));
      }, delay);
    });
  };
}

function createListItem(arr) {
  return arr
    .map((x) => {
      return `<li onclick="handleChurchClick(this)" data-name="${x.name}">${x.fullname}</li>`;
    })
    .join("\n");
}

function handleChurchClick(e) {
  const name = e.getAttribute("data-name");
  const item = churchData.find((x) => x.name === name);
  displayChurchInfo(item)
}

function displayChurchInfo(item) {
    const htmlTemplate = `
    <h2>${item.fullname}</h2>
    <p>${item.direction}</p>
    `
    churchInfoBoard.innerHTML = htmlTemplate
}
