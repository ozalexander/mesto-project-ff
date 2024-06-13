import '../pages/index.css';
import { createCard, deleteThisCard, changeLike } from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getCards, getProfile, patchProfile, addCard, deleteCardByID, changeProfileAvatar, toggleLike } from './api.js'

const popupList = document.querySelectorAll('.popup');
const popupContentList = document.querySelectorAll('.popup__content');
const formElement = '.popup__form';
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
const deleteCardForm = document.getElementsByName('confirm-delete')[0];
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const newCardBtn = document.querySelector('.profile__add-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const zoomImgPopup = document.querySelector('.popup_type_image');
const changeAvatarPopup = document.querySelector('.popup_type_avatar');
const deleteConfirmationPopup = document.querySelector('.popup_type_delete');
const errorPopup = document.querySelector('.popup_type_error');
const errorPopupSubmit = errorPopup.querySelector(formElement);
const editProfileForm = editProfilePopup.querySelector(formElement);
const addCardForm = addCardPopup.querySelector(formElement);
const changeAvatarForm = changeAvatarPopup.querySelector(formElement);

const listOfFunctions = { zoomPicture, deleteCard, handleLikes };
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}


popupList.forEach(popup => popup.classList.add('popup_is-animated'))
document.querySelectorAll('.popup__button').forEach(input => input.disabled = true)

avatar.addEventListener('click', () => {
  openPopup(changeAvatarPopup);
  avatarInput.value = '';
  avatarInput.focus();
  clearValidation(changeAvatarForm, validationConfig)
})

buttonEditProfile.addEventListener('click', (() => {
  openPopup(editProfilePopup);
  nameInput.value = defaultName.textContent;
  jobInput.value = defaultJob.textContent;
  nameInput.focus();
  clearValidation(editProfileForm, validationConfig)
}));

newCardBtn.addEventListener('click', (() => {
  openPopup(addCardPopup); 
  placeInputName.focus(); 
  clearValidation(addCardForm, validationConfig)
}));

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editProfileForm.querySelector('.popup__button').textContent = 'Сохранение...';
  patchProfile(nameInput, jobInput)
    .then(() => {
      defaultName.textContent = nameInput.value;
      defaultJob.textContent = jobInput.value;
      closePopup(editProfilePopup)
    })
    .catch(handleError)
    .finally(editProfileForm.querySelector('.popup__button').textContent = 'Сохранить')
}

editProfileForm.addEventListener('submit', evt => handleEditFormSubmit(evt));

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  addCardForm.querySelector('.popup__button').textContent = 'Сохранение...';
  addCard(placeInputName, placeInputLink)
    .then((res) => {
      placesList.prepend(createCard(res, listOfFunctions, res.owner._id))
      closePopup(addCardPopup);
      placeInputName.value = '';
      placeInputLink.value = '';
    })
    .catch(handleError)
    .finally(addCardForm.querySelector('.popup__button').textContent = 'Сохранить')
}

addCardForm.addEventListener('submit', evt => handleAddFormSubmit(evt));

let cardToDelete = null;

function deleteCard (id, element) {
  cardToDelete = {id, element};
  openPopup(deleteConfirmationPopup);
}

deleteCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    deleteCardByID(cardToDelete.id)
      .then(() => {
          deleteThisCard(cardToDelete.element);
          closePopup(deleteConfirmationPopup);
          cardToDelete = {};
        })
      .catch(handleError)
})

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  changeAvatarForm.querySelector('.popup__button').textContent = 'Сохранение...';
  changeProfileAvatar(avatarInput.value)
    .then(() => {
      closePopup(changeAvatarPopup);
      avatar.style.backgroundImage = `url(${avatarInput.value})`
    })
    .catch(handleError)
    .finally(changeAvatarForm.querySelector('.popup__button').textContent = 'Сохранить')
}

changeAvatarForm.addEventListener('submit', evt => handleEditAvatarSubmit(evt));

function zoomPicture(card) {
  openPopup(zoomImgPopup);
  popupImage.src = card.src;
  popupImage.alt = card.alt;
  popupCaption.textContent = card.alt;
}

function handleLikes (id, obj, likeState) {
  toggleLike(id, likeState) 
    .then(res => changeLike(obj, res.likes.length)) 
    .catch(handleError) 
}

popupContentList.forEach(popupContent => popupContent.addEventListener('click', evt => evt.stopPropagation()));
popupList.forEach(popup => popup.querySelector('.popup__close').addEventListener('click', () => closePopup(popup)))

errorPopupSubmit.addEventListener('submit', (evt) => {
  evt.preventDefault();
  closePopup(errorPopup);
})

enableValidation(validationConfig);

const handleError = (err) => {
  console.log(err)
  errorPopup.querySelector('.popup__title').textContent = `${err.message}. Ошибка: ${err.httpResponseCode}`;
  openPopup(errorPopup);
}

Promise.all([getCards(), getProfile()])
  .then(([cardsRes, profileRes]) => {
    cardsRes.forEach(card => placesList.append(createCard(card, listOfFunctions, profileRes._id)));
    defaultName.textContent = profileRes.name;
    defaultJob.textContent = profileRes.about;
    avatar.style.backgroundImage = `url(${profileRes.avatar})`})
  .catch(handleError)
