export { enableValidation, clearValidation }

function enableValidation({formSelector, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass}) {
  document.querySelectorAll(formSelector).forEach((formElement) => {
    setEventListeners(formElement, inputSelector, inputErrorClass, errorClass, submitButtonSelector, inactiveButtonClass);
  });
}
  
const setEventListeners = (formElement, inputSelector, inputErrorClass, errorClass, submitButtonSelector, inactiveButtonClass) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
      } else {
        inputElement.setCustomValidity("");
      }
      toggleButtonState(inputList, formElement.querySelector(submitButtonSelector), inactiveButtonClass)
      checkInputValidity(formElement, inputElement, inputErrorClass, errorClass);
    });
  });
}

const checkInputValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, inputErrorClass, errorClass);
  } else {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  }
}

function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

const showInputError = (formElement, inputElement, errorMessage, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-popup__error`);
  inputElement.classList.add(inputErrorClass)
  errorElement.classList.add(errorClass)
  errorElement.textContent = errorMessage;
};

const hideInputError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-popup__error`);
  inputElement.classList.remove(inputErrorClass)
  errorElement.classList.remove(errorClass)
};

const clearValidation = (formElement, { submitButtonSelector, inputSelector, inactiveButtonClass, inputErrorClass, errorClass }) => {
  formElement.querySelectorAll(inputSelector).forEach(inputElement => hideInputError(formElement, inputElement, inputErrorClass, errorClass));
  formElement.querySelector(submitButtonSelector).classList.add(inactiveButtonClass);
};
