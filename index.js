"use strict";

let library = [];

function Book(name, author, pages, isRead, id) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.id = id;
}

Book.prototype.describe = function () {
  return `${this.name} by ${this.author}, ${this.pages} pages long, ${
    this.isRead ? "have read it" : "not read it yet"
  }`;
};

// index books in library

let hobbit = new Book("The Hobbit", "R.R. Tolkien", 297, true);

//DOM
const form = document.querySelector("#book-form");
const add = document.querySelector("#add");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const numPages = document.querySelector("#num-pages");
const isRead = document.querySelector("#isRead");
const closeForm = document.querySelector("#close-form");
const table = document.querySelector("#table");
const toggleForm = document.querySelector("#toggle-form");
const header = document.querySelector("#header");
const main = document.querySelector("#main");
const bookCount = document.querySelector("#book-count");
const removeAllBtn = document.querySelector("#remove-all");
//form alerts

function addErrorMsg(field, errorMsg) {
  const errorText = `<div class="error-text">
  <span>${errorMsg}</span>
</div>`;
  const errorIcon = `<div class="sign error-sign">!</div>`;
  field.className += " error-field";
  field.insertAdjacentHTML("afterend", errorIcon);
  field.insertAdjacentHTML("afterend", errorText);
  field.removeAttribute("placeholder");
}

function removeErrorMsg(field) {
  const errorIcons = document.querySelectorAll(".sign");
  const errorTexts = document.querySelectorAll(".error-text");
  field.classList.remove("error-field");
  for (let errorIcon of errorIcons) {
    if (field.parentNode == errorIcon.parentNode) {
      field.parentNode.removeChild(errorIcon);
    }
  }
  for (let errorText of errorTexts) {
    if (field.parentNode == errorText.parentNode) {
      field.parentNode.removeChild(errorText);
    }
  }
}

function validate(type, pattern, errorMsg) {
  if (type.value == "") {
    if (type.className == " error-field") return;
    addErrorMsg(type, "Field cannot be empty");
  } else if (!pattern.test(type.value)) {
    removeErrorMsg(type);
    addErrorMsg(type, errorMsg);
  } else {
    removeErrorMsg(type);
  }
}

function checkIfRead(input) {
  return input.checked ? "read" : "not read";
}

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

//book count
function countBooks() {
  if (library.length == 0) {
    bookCount.innerText = "There are no books in your library.";
  } else if (library.length == 1) {
    bookCount.innerText = `There is ${library.length} book in your library.`;
  } else {
    bookCount.innerText = `There are ${library.length} books in your library`;
  }
}

// initiate book count
countBooks();

function createBook(title, author, pages, isRead) {
  // guard clause for empty form submit
  if (title.value == "" || author.value == "" || pages.value == "") return;
  // create book id
  const id = generateUUID();

  // create elements
  const row = document.createElement("ul");
  row.classList += "table__row";

  const bookTitle = document.createElement("li");
  bookTitle.classList += "table__title table__item";
  bookTitle.innerText = title.value;
  row.setAttribute("data-id", `${id}`);
  const bookAuthor = document.createElement("li");
  bookAuthor.classList += "table__author table__item";
  bookAuthor.innerText = author.value;
  const bookPages = document.createElement("li");
  bookPages.classList += "table__pages table__item";
  bookPages.innerText = pages.value;
  const isBookRead = document.createElement("button");
  isBookRead.classList += "table__item";
  // change classlist based if book is read
  isBookRead.classList += isRead.checked
    ? " button-read--y"
    : " button-read--n";
  isBookRead.innerText = checkIfRead(isRead);
  isBookRead.setAttribute("data-type", "toggle-read");
  const button = document.createElement("button");
  button.classList += "delete-btn table__item";
  button.innerHTML = "&times;";
  button.setAttribute("data-type", "delete");
  // append to row
  function insertEl(parentEl, childEl) {
    parentEl.insertAdjacentElement("beforeend", childEl);
  }
  insertEl(row, bookTitle);
  insertEl(row, bookAuthor);
  insertEl(row, bookPages);
  insertEl(row, isBookRead);
  insertEl(row, button);

  // table.appendChild;
  insertEl(table, row);
  // add to array
  const book = new Book(
    title.value,
    author.value,
    pages.value,
    isRead.checked,
    id
  );
  // add book to library
  library.push(book);
  // reset form values
  title.value = author.value = pages.value = null;
  isRead.checked = false;
}

function addBook() {
  // validate data
  validate(
    title,
    /^[A-Za-z][A-Za-z'-]+([ A-Za-z][A-Za-z'-]+)*/,
    "Field can only contain letters, apostrophes and hyphens."
  );
  validate(
    author,
    /^[A-Za-z][A-Za-z'.-]+([ A-Za-z][A-Za-z'.-]+)*/,
    "Field can only contain letters, apostrophes and hyphens."
  );
  validate(
    numPages,
    /^(0?[1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|9999)$/,
    "Field can only container numbers from 1 to 9999"
  );
  // create DOM Element
  createBook(title, author, numPages, isRead);
  countBooks();
}

// form submit event listener

add.addEventListener("click", (e) => {
  e.preventDefault();
  addBook();
});

// delete book

function removeBook() {
  window.addEventListener("click", (e) => {
    if (table.children.length) {
      if (e.target.dataset.type == "delete") {
        // remove element from DOM
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        // remove element from library array
        for (let book of library) {
          // console.log(library[i]);
          if (book.id == e.target.parentNode.getAttribute("data-id")) {
            library.splice(library.indexOf(book), 1);
          }
        }
      }
    }
    countBooks();
  });
}

removeBook();

// toggle read class and book.isRead property
function toggleRead() {
  window.addEventListener("click", (e) => {
    if (e.target.dataset.type == "toggle-read") {
      const toggleReadBtn = e.target;
      const currentBook = e.target.parentNode;
      for (let book of library) {
        if (book.id == currentBook.getAttribute("data-id")) {
          toggleReadBtn.classList.add(
            book.isRead ? "button-read--n" : "button-read--y"
          );
          toggleReadBtn.classList.remove(
            book.isRead ? "button-read--y" : "button-read--n"
          );
          toggleReadBtn.innerText = book.isRead ? "Not read" : "Read";
          book.isRead = book.isRead ? false : true;
        }
      }
    }
  });
}

toggleRead();

// toggle form
toggleForm.addEventListener("click", () => {
  header.classList.toggle("toggle-header");
  main.classList.toggle("toggle-main");
  toggleForm.classList.toggle("toggle-button");
});

// remove all
function removeAll() {
  if (library.length == 0) return;
  // remove all elements from DOM
  while (table.firstChild) {
    table.removeChild(table.lastChild);
  }
  // clear array
  library = [];
}

removeAllBtn.addEventListener("click", () => {
  removeAll();
});
