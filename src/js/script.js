"use strict";
let menuButton = document.querySelector(".burger-img");
let menuOpenedButton = document.querySelector('.burger-opened-img')
let headerList = document.querySelector(".header__list");
let headerMenu = document.querySelector('.header__menu')
let headerMenuLink = Array.from(document.querySelectorAll('.header__menu-link'))


menuButton.addEventListener("click",(e) =>{
    headerList.classList.toggle("header__list--opened")
    menuButton.style.display = 'none'
    menuOpenedButton.style.display = 'block'
  });
document.addEventListener("click", (e) => {
  if (e.target !== menuButton && !headerMenuLink.includes(e.target)){
    headerList.classList.remove("header__list--opened")
    menuButton.style.display = 'block'
    menuOpenedButton.style.display = 'none'
  }
}
);


