import '../pages/index.css';
import { createCard, deleteThisCard, cardLike } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getCards, getProfile, patchProfile, addCard, deleteCardByID, likeById, deleteLikeById, changeProfileAvatar } from './api.js'

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
const errorPopupEl = document.querySelector('.popup_type_error');
const popupOpened = 'popup_is-opened';
const formEditProfile = 0, formAddCard = 1, imgZoom = 2, avatarEdit = 3, deleteCardConfirm = 4, errorPopup = 5;
const listOfFunctions = { deleteThisCard, zoomPicture, cardLike, deleteCardByID, likeById, deleteLikeById, openPopup };
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
  formElement[formEditProfile].querySelector('.popup__button').textContent = '';
  formElement[formEditProfile].querySelector('.popup__button').classList.add('popup__button-loading');
  patchProfile(nameInput, jobInput)
    .then((res) => {
      if (res.ok) {
        setTimeout(() => { 
          defaultName.textContent = nameInput.value;
          defaultJob.textContent = jobInput.value;
        }, 2000)
      } else {
        handleError(res)
      }
    })
    .catch((err)=> console.log(err))
    .finally(()=> {
      setTimeout(() => {
        closePopupShort(formEditProfile);
        formElement[formEditProfile].querySelector('.popup__button').classList.remove('popup__button-loading');
      }, 2000);
      setTimeout(() => {formElement[formEditProfile].querySelector('.popup__button').textContent = 'Сохранить'}, 2500)
    })
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
  if (placeInputName.value==='' && placeInputLink.value===''){
    closePopupShort(formAddCard);
  } else {
    formElement[formAddCard].querySelector('.popup__button').textContent = '';
    formElement[formAddCard].querySelector('.popup__button').classList.add('popup__button-loading');
    addCard(placeInputName, placeInputLink)
      .then((res) => {
        if (res.ok) {
          setTimeout(() => { 
            buffer.unshift({name: placeInputName.value, link: placeInputLink.value});
            placesList.insertBefore(createCard(buffer[0], listOfFunctions, 0, true), placesList.firstChild);
            buffer.shift()
          }, 2000)
        } else {
          handleError(res)
        }
      })
      .catch((err)=> console.log(err))
      .finally(()=> {
        setTimeout(() => {
          closePopupShort(formAddCard)
          formElement[formAddCard].querySelector('.popup__button').classList.remove('popup__button-loading'); 
        }, 2000)
        setTimeout(() => {
          reset; 
          formElement[formEditProfile].querySelector('.popup__button').textContent = 'Сохранить'
        }, 2500)
      })
  }
}

formElement[formAddCard].addEventListener('submit', (evt) => handleAddFormSubmit(evt));

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  formElement[avatarEdit-1].querySelector('.popup__button').textContent = '';
  formElement[avatarEdit-1].querySelector('.popup__button').classList.add('popup__button-loading');
  changeProfileAvatar(avatarInput)
    .then((res) => {
     if (res.ok) {
        setTimeout(() => {avatar.style.backgroundImage = `url(${avatarInput.value})`}, 2000)
      } else {
        handleError(res)
      }
    })
    .catch((err)=> console.log(err))
    .finally(()=> {
      setTimeout(() => {
        formElement[avatarEdit-1].querySelector('.popup__button').classList.remove('popup__button-loading');
        closePopupShort(avatarEdit)
      }, 2000)
      setTimeout(() => {reset; formElement[avatarEdit-1].querySelector('.popup__button').textContent = 'Сохранить'}, 2500)
    })
  }

formElement[avatarEdit-1].addEventListener('submit', (evt) => handleEditAvatarSubmit(evt));

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  closePopupShort(deleteCardConfirm);
}

formElement[deleteCardConfirm-1].addEventListener('submit', (evt) => handleDeleteCardSubmit(evt));

errorPopupEl.addEventListener('submit', (evt) => {
  evt.preventDefault();
  closePopupShort(errorPopup);
})

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

for (let i = 0; i < popup.length; i++) { closePopupButtonNoBubbling(i) };

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

const handleError = (res) => {
  popup[errorPopup].querySelector('.popup__title').textContent = `Ошибка: ${res.status}`;
  openPopupShort(errorPopup);
  return Promise.reject(`Ошибка: ${res.status}`)
}

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
    }
  handleError(res)
}

getCards()
.then((res) => handleResponse(res))
.then((res) => {
  res.forEach(card => placesList.append(createCard(card, listOfFunctions, card.likes.length)));
})
.catch((err) => console.log(err))

getProfile()
.then((res) => handleResponse(res))
.then((res) => {
  defaultName.textContent = res.name;
  defaultJob.textContent = res.about;
  nameInput.value = defaultName.textContent;
  jobInput.value = defaultJob.textContent;
  avatar.style.backgroundImage = `url(${res.avatar})`;
})
.catch((err) => console.log(err))
