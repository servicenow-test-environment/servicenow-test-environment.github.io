export function validation(response,btn,notValidated){

    if (response) {
      btn.style.display = 'none'
      document.querySelector('.validated').style.display = 'block'
    }
    else {
      btn.disabled = false;
      btn.classList.remove('no-hover')
      btn.classList.remove('grey-me')
  
      notValidated.style.display = 'block'
  
  
    }
    // return btn,notValidated
  }