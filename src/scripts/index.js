import '../pages/index.css';
import { initialCards } from '../scripts/cards.js';
import { creatCard, deleteThisCard, cardLike } from './card.js';
import { handleFormSubmit, closePopup, zoomPicture } from './modal.js';
export { popup, popupClose, popupContent, popupImage, popupCaption, placeName, placeLink, nameJob, job, addPlace, name, jobInput, zoomImg, nameInput, placesList, formElement }

const popup = document.querySelectorAll('.popup');
const popupClose = document.querySelectorAll('.popup__close');
const popupContent = document.querySelectorAll('.popup__content');
const formElement = document.querySelectorAll('.popup__form');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const placeName = document.querySelector('.popup__input_type_card-name');
const placeLink = document.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');
const editProfile = document.querySelector('.profile__edit-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const name = document.querySelector('.profile__title');
const job = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const newCardBtn = document.querySelector('.profile__add-button');
const newCard = document.querySelector('.popup_type_new-card');
const nameJob = 0, addPlace = 1, zoomImg = 2;

for (let i = 0; i < popup.length; i++) {
  popup[i].classList.add('popup_is-animated');
}

nameInput.value = name.textContent;
jobInput.value = job.textContent;

initialCards.forEach(card => placesList.append(creatCard(card, { deleteCard : deleteThisCard, zoomCard : zoomPicture, like : cardLike })));

formElement[nameJob].addEventListener('submit', handleFormSubmit);
formElement[addPlace].addEventListener('submit', handleFormSubmit);

editProfile.addEventListener('click', (function(evt) {
  editProfilePopup.classList.add('popup_is-opened');
  closePopup(nameJob);
}));

newCardBtn.addEventListener('click', (function(evt) {
  newCard.classList.add('popup_is-opened');
  closePopup(addPlace);
}));
