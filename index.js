"use strict";

let library = [];

function Book(name, author, pages, isRead) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.describe = function () {
  return `${this.name} by ${this.author}, ${this.pages} pages long, ${
    this.isRead ? "have read it" : "not read it yet"
  }`;
};

// index books in library

let hobbit = new Book("The Hobbit", "R.R. Tolkien", 297, true);

//DOM
const add = document.querySelector("#add");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const numPages = document.querySelector("#num-pages");
const isRead = document.querySelectorAll("[name='isRead']");

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
  } else if (pattern.test(type.value) == false) {
    removeErrorMsg(type);
    addErrorMsg(type, errorMsg);
  } else {
    removeErrorMsg(type);
  }
}

function filterRadio(radioBtns) {
  let arr = Array.from(radioBtns);
  for (let btn of arr) {
    if (btn.checked) {
      return btn.value;
    }
  }
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
  console.log(title.value, author.value, numPages.value);
  console.log(filterRadio(isRead));
}

// form submit event listener

add.addEventListener("click", (e) => {
  e.preventDefault();
  addBook();
});
