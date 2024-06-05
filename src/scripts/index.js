import '../pages/index.css';
import { createCard, deleteThisCard, cardLike } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';

const popup = document.querySelectorAll('.popup');
const buttonClose = document.querySelectorAll('.popup__close');
const popupContent = document.querySelectorAll('.popup__content');
const formElement = document.querySelectorAll('.popup__form');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const placeInputName = document.querySelector('.popup__input_type_card-name');
const placeInputLink = document.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');
const buttonEditProfile = document.querySelector('.profile__edit-button');
const defaultName = document.querySelector('.profile__title');
const defaultJob = document.querySelector('.profile__description');
const avatar = document.querySelector('.profile__image');
const avatarInput = document.querySelector('.popup__input_avatar');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const newCardBtn = document.querySelector('.profile__add-button');
const popupOpened = 'popup_is-opened';
const formEditProfile = 0, formAddCard = 1, imgZoom = 2, avatarEdit = 3, deleteCardConfirm = 4;
const listOfFunctions = { deleteCard : deleteThisCard, zoomCard : zoomPicture, like : cardLike, deleteId : deleteCardByID, likeId : likeById, delLikeId : deleteLikeById, openDeletePopup : openPopup };
const openPopupShort = (typeOfForm) => openPopup(popup[typeOfForm], popupOpened);
const closePopupShort = (typeOfForm) => closePopup(popup[typeOfForm], popupOpened);

for (let i = 0; i < popup.length; i++) { popup[i].classList.add('popup_is-animated') }

avatar.addEventListener('click', () => {
  openPopupShort(avatarEdit);
  avatarInput.focus();
})

buttonEditProfile.addEventListener('click', (() => {
  openPopupShort(formEditProfile);
  nameInput.focus();
  clearValidation(formElement[formEditProfile], { 
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    errorClass: '.popup__error_visible'
  })
}));

newCardBtn.addEventListener('click', (() => {
  openPopupShort(formAddCard); 
  placeInputName.focus(); 
}));

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  defaultName.textContent = nameInput.value;
  defaultJob.textContent = jobInput.value;
  fetchProfile(defaultName, defaultJob);
  closePopupShort(formEditProfile);
}

formElement[formEditProfile].addEventListener('submit', (evt) => handleEditFormSubmit(evt));

function reset() {
  placeInputName.value = '';
  placeInputLink.value = '';
  clearValidation(formElement[formAddCard], { 
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    errorClass: '.popup__error_visible'
  })
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const buffer = [];
  buffer.unshift({name: placeInputName.value, link: placeInputLink.value});
  placesList.insertBefore(createCard(buffer[0], listOfFunctions, 0, true), placesList.firstChild);
  buffer.shift();
  setTimeout(reset, 600);
  closePopupShort(formAddCard);
  addCard(placeInputName, placeInputLink);
}

formElement[formAddCard].addEventListener('submit', (evt) => handleAddFormSubmit(evt));

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  avatar.style.backgroundImage = `url(${avatarInput.value})`;
  changeProfileAvatar(avatarInput.value);
  closePopupShort(avatarEdit);
}

formElement[avatarEdit-1].addEventListener('submit', (evt) => handleEditAvatarSubmit(evt));


function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  closePopupShort(deleteCardConfirm);
  return true
}

formElement[deleteCardConfirm-1].addEventListener('submit', (evt) => handleDeleteCardSubmit(evt));

function zoomPicture(card) {
  openPopupShort(imgZoom);
  popupImage.src = card.src;
  popupImage.alt = card.alt;
  popupCaption.textContent = card.alt;
}

function closePopupButtonNoBubbling(popupType) {
  popupContent[popupType].addEventListener('click', (evt) => evt.stopPropagation());
  buttonClose[popupType].addEventListener('click', () => closePopupShort(popupType));
}

[formEditProfile, formAddCard, imgZoom, avatarEdit, deleteCardConfirm].forEach(i => closePopupButtonNoBubbling(i));

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

fetch('https://nomoreparties.co/v1/wff-cohort-15/cards', {
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0'
  }
})
  .then(res => res.json())
  .then((res) => {
    res.forEach(card => placesList.append(createCard(card, listOfFunctions, card.likes.length)));
    console.log(res)
  })

fetch('https://nomoreparties.co/v1/wff-cohort-15/users/me', {
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0'
  }
})
  .then(res => res.json())
  .then((res) => {
    defaultName.textContent = res.name;
    defaultJob.textContent = res.about;
    nameInput.value = defaultName.textContent;
    jobInput.value = defaultJob.textContent;
    avatar.style.backgroundImage = `url(${res.avatar})`;
    console.log(res);
  });

const fetchProfile = (defaultName, defaultJob) => fetch('https://nomoreparties.co/v1/wff-cohort-15/users/me', {
  method:'PATCH',
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name : defaultName.textContent,
    about : defaultJob.textContent,
  })
})

const addCard = (placeInputName, placeInputLink) => fetch('https://nomoreparties.co/v1/wff-cohort-15/cards', {
  method:'POST',
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name : placeInputName.value,
    link : placeInputLink.value,
  })
})


function deleteCardByID(cardId) {
  fetch(`https://nomoreparties.co/v1/wff-cohort-15/cards/${cardId}`, {
    method:'DELETE',
    headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    },
  })
}

function likeById(cardId) {
  fetch(`https://nomoreparties.co/v1/wff-cohort-15/cards/likes/${cardId}`, {
    method:'PUT',
    headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    },
  })
}

function deleteLikeById(cardId) {
  fetch(`https://nomoreparties.co/v1/wff-cohort-15/cards/likes/${cardId}`, {
    method:'DELETE',
    headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    },
  })
}

const changeProfileAvatar = (input) => fetch('https://nomoreparties.co/v1/wff-cohort-15/users/me/avatar', {
  method:'PATCH',
  headers: {
    authorization: 'ba744ed5-837c-473f-902f-5686fb20a2a0',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    avatar : input
  })
})
