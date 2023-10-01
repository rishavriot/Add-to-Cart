import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//testing
import PopupManager from "https://cdn.jsdelivr.net/gh/jorgeabrahan/popup_library@67068b1/popup/Popup.js";

// custom close button
const btnClose = '<span class="material-symbols-outlined">close</span>';
// custom styles
const style = "border-width: 2px; border-style: solid; border-color: gray";
// init
const Popup = new PopupManager({ btnClose, style });

//testing

const appSettings = {
  databaseURL:
    "https://realtime-database-5631e-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

//testing

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  if (inputValue === "") {
    Popup.display({
      title: "Empty box!",
      content: "Please Enter to add",
    });
  } else {
    push(shoppingListInDB, inputValue);
  }

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
