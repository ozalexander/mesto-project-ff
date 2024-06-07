export { createCard, deleteThisCard, cardLike }

function createCard(item, { deleteThisCard, zoomPicture, cardLike, deleteCardByID, likeById, deleteLikeById, openPopup }, likes) {
  const cardsTemplate = document.querySelector('#card-template').content;
  const cardsElement = cardsTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardsElement.querySelector('.card__delete-button');
  const deleteCardPopup = document.querySelector('.popup_type_delete');
  const cardTitle = cardsElement.querySelector('.card__title');
  const cardImage = cardsElement.querySelector('.card__image');
  const likeButton = cardsElement.querySelector('.card__like-button');
  const likeCount = cardsElement.querySelector('.card__like-button-counter');
  let loaderImg = new Image();
  loaderImg.src = item.link;
  cardImage.src = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2xodnh1MXk4MGN5M3kxNDdpNXRkZjBnOWQyYzIwc2gzZ21rMHhidCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4EFt4UAegpqTy3nVce/giphy.webp";
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  likeCount.textContent = likes;
  loaderImg.onload = () => cardImage.src = item.link;
  loaderImg.onerror = () => {
    cardImage.src = 'https://media1.tenor.com/m/CBtVxFR3-oYAAAAC/error.gif';
    cardImage.style.pointerEvents = 'none';
  }
  try {
    if(item.likes.some(user => user._id === "10d544c5bdef65a02d074b65")){
    likeButton.classList.add('card__like-button_is-active');
    }
  } catch { }
  if (item.owner._id==="10d544c5bdef65a02d074b65"){
    deleteButton.addEventListener('click', () => { 
      openPopup(deleteCardPopup, 'popup_is-opened');
      deleteCardPopup.addEventListener('submit', () =>{
        deleteThisCard(cardsElement);
        deleteCardByID(item._id);
      })
    })
  } else {
    deleteButton.remove()
  }
  cardImage.addEventListener('click', () => zoomPicture(cardImage));
  likeButton.addEventListener('click', () => {
    let likesCounter = Number(likeCount.textContent);
    if(likeButton.classList.contains('card__like-button_is-active')) {
      deleteLikeById(item._id);
      cardLike(likeButton, likeCount);
      likeCount.textContent = likesCounter-1;
    } else {
      cardLike(likeButton, likeCount);
      likeById(item._id);
      likeCount.textContent = likesCounter+1;
    }
  });
  return cardsElement;
}

const deleteThisCard = (card) => card.remove()

const cardLike = (card, likeCount) => {
  card.classList.toggle('card__like-button_is-active');
  likeCount.classList.toggle('card__like-button-counter-change');
}
