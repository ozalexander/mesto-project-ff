export { createCard, deleteThisCard, cardLike, tempId }

let tempId = 0;

function createCard(item, { zoomPicture, cardLike, likeById, deleteLikeById }, likes, myId) {
  const cardsTemplate = document.querySelector('#card-template').content;
  const cardsElement = cardsTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const likeButton = cardsElement.querySelector('.card__like-button');
  const likeCount = cardsElement.querySelector('.card__like-button-counter');
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  likeCount.textContent = likes;
  try {
    if(item.likes.some(user => user._id === myId)){
    likeButton.classList.add('card__like-button_is-active');
    }
  } catch { }
  if (item.owner._id === myId){
    deleteButton.addEventListener('click', () => {
      tempId = item._id;
      cardsElement.id = tempId;
    })
  } else {
    deleteButton.remove()
  }
  cardImage.addEventListener('click', () => zoomPicture(cardImage));
  likeButton.addEventListener('click', () => {
    if(likeButton.classList.contains('card__like-button_is-active')) {
      deleteLikeById(item._id)
        .then((res) => {
          likeCount.textContent = res.likes.length
          cardLike(likeButton, likeCount)
        })
        .catch(console.dir)
    } else {
      likeById(item._id)
        .then((res) => {
          likeCount.textContent = res.likes.length
          cardLike(likeButton, likeCount)     
          })
        .catch(console.dir)
    }
  });
  return cardsElement;
}

const deleteThisCard = (card) => card.remove()

const cardLike = (card, likeCount) => {
  card.classList.toggle('card__like-button_is-active');
  likeCount.classList.toggle('card__like-button-counter-change')
}
