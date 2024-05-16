import '../pages/index.css';
import {initialCards} from '../scripts/cards.js';

const cardsTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const deleteThisCard = (evt) => evt.target.closest('.card').remove();
const editProfile = document.querySelector('.profile__edit-button');
const popup = document.querySelectorAll('.popup');
const popupClose = document.querySelectorAll('.popup__close');
const editProfilePopup = document.querySelector('.popup_type_edit');
const formElement = document.querySelector('.popup__form');
const name = document.querySelector('.profile__title');
const job = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const popupContent = document.querySelectorAll('.popup__content');
const newCardBtn = document.querySelector('.profile__add-button');
const newCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption')
const nameJob = popup[0];
const addPlace = popup[1];
const zoomImg = popup[2];

for (let i = 0; i <popup.length; i++) {
  popup[i].classList.add('popup_is-animated');
}

function creatCard(item, { deleteCard, zoomCard }) {
  const cardsElement = cardsTemplate.cloneNode(true);
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  deleteButton.addEventListener('click', deleteCard);
  cardImage.addEventListener('click', zoomCard)
  return cardsElement;
}

initialCards.forEach(card => placesList.append(creatCard(card, { deleteCard : deleteThisCard, zoomCard : cardZoomFunc})));

function popupListener(popupType) {
  document.addEventListener('keydown', (function(evt) {
  if (evt.key === 'Escape') {
    popupType.classList.remove('popup_is-opened')
  }
}))}

function handleFormSubmit(evt) {
  evt.preventDefault();
  job.textContent = jobInput.value;
  name.textContent = nameInput.value;
  popup[0].classList.remove('popup_is-opened');
}
formElement.addEventListener('submit', handleFormSubmit);

function popupFunc(popupType) {
  popupListener(popupType);
  popupClose[0].addEventListener('click', (() => popupType.classList.remove('popup_is-opened')));
  popupContent[0].addEventListener('click', (evt => evt.stopPropagation()));
  popupType.addEventListener('click', (() => popupType.classList.remove('popup_is-opened')));
}

editProfile.addEventListener('click', (function(evt) {
  editProfilePopup.classList.add('popup_is-opened');
  popupFunc(nameJob);
}));

nameInput.value = name.textContent;
jobInput.value = job.textContent;

newCardBtn.addEventListener('click', (function(evt) {
  newCard.classList.add('popup_is-opened');
  popupFunc(addPlace);
}));

function cardZoomFunc(evt) {
  zoomImg.classList.add('popup_is-opened');
  popupImage.src = evt.target.closest('.card__image').src;
  popupCaption.textContent = evt.target.closest('.card__image').alt;
  popupFunc(zoomImg);
}
