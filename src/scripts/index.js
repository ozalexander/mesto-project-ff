import '../pages/index.css';
import { initialCards } from '../scripts/cards.js';
import { createCard, deleteThisCard, cardLike } from './card.js';
import { openPopup, closePopup } from './modal.js';

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
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const newCardBtn = document.querySelector('.profile__add-button');
const popupOpened = 'popup_is-opened';
const formEditProfile = 0, formAddCard = 1, imgZoom = 2;
const listOfFunctions = { deleteCard : deleteThisCard, zoomCard : zoomPicture, like : cardLike };
const openPopupShort = (typeOfForm) => openPopup(popup[typeOfForm], popupOpened);
const closePopupShort = (typeOfForm) => closePopup(popup[typeOfForm], popupOpened);

initialCards.forEach(card => placesList.append(createCard(card, listOfFunctions)));

for (let i = 0; i < popup.length; i++) { popup[i].classList.add('popup_is-animated') }

nameInput.value = defaultName.textContent;
jobInput.value = defaultJob.textContent;

buttonEditProfile.addEventListener('click', (() => {openPopupShort(formEditProfile), nameInput.focus();}));
newCardBtn.addEventListener('click', (() => {openPopupShort(formAddCard), placeInputName.focus()}));

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  defaultName.textContent = nameInput.value;
  defaultJob.textContent = jobInput.value;
  closePopupShort(formEditProfile);
}

formElement[formEditProfile].addEventListener('submit', (evt) => handleEditFormSubmit(evt));

function reset() {
  placeInputName.value = '';
  placeInputLink.value = '';
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  initialCards.unshift({name: placeInputName.value, link: placeInputLink.value});
  placesList.insertBefore(createCard(initialCards[0], listOfFunctions), placesList.firstChild);
  closePopupShort(formAddCard);
  setTimeout(reset, 600);
}

formElement[formAddCard].addEventListener('submit', (evt) => handleAddFormSubmit(evt));

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

[formEditProfile, formAddCard, imgZoom].forEach(i => closePopupButtonNoBubbling(i));
