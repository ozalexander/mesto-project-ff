import '../pages/index.css';
import {initialCards} from '../scripts/cards.js';

const cardsTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const deleteThisCard = (evt) => evt.target.closest('.card').remove();

function creatCard(item, { deleteCard }) {
  const cardsElement = cardsTemplate.cloneNode(true);
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  deleteButton.addEventListener('click', deleteCard);
  return cardsElement;
}

initialCards.forEach(card => placesList.append(creatCard(card, { deleteCard : deleteThisCard })));

