export { creatCard, deleteThisCard, cardLike }

function creatCard(item, { deleteCard, zoomCard, like }) {
  const cardsTemplate = document.querySelector('#card-template').content;
  const cardsElement = cardsTemplate.cloneNode(true);
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  const likeButton = cardsElement.querySelector('.card__like-button');
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  deleteButton.addEventListener('click', deleteCard);
  cardImage.addEventListener('click', zoomCard);
  likeButton.addEventListener('click', like);
  return cardsElement;
}

const deleteThisCard = (evt) => evt.target.closest('.card').remove();
const cardLike = (evt) => evt.target.closest('.card__like-button').classList.toggle('card__like-button_is-active');
