import { credentials } from './app.js';
import { render, html, page } from './lib.js'
import { snowConnection } from './servicenowConn.js';
// import {ServiceNow} from './lib/servicenow copy.js'
// import { snowConnection } from './servicenowConn.js';


const loginPageTemplate = (onSubmit) => html`

<section class="login">
    <div class="color-spliter">

    </div>
    <div class="login-wrapper">
        <div class="logo"> 
        <img src="./img/DIW-logo.png" alt="" class="diw-logo">
            <!-- <img src="./img/SN.png"  width="200px" height="200px" background="grey" padding="10px" alt="" class="diw-logo">
            <img src="./img/js.png" alt=""> -->
            <!-- <img src="./img/DIW-logo.png" alt=""> -->
        </div>
        <form @submit=${(event) => onSubmit(event)} id="login">
            
            <div class="container">
            <p class="error-msg">Please provide working instance and correct credentials!</p>

                
              <label for="instanceName">Instance Name:</label>
              <input type="text" id="instanceName" name="instanceName" class="light-me-up" value="dev104479" placeholder="dev123456.service-now.com"/>

              <label for="instanceUserName">Instance User Name:</label>
              <input type="text" id="instanceUserName" name="instanceUserName" class="light-me-up" value="admin" placeholder="admin"/>

              <label for="instance-pass">Instance Password:</label>
              <input type="password" id="instance-password" name="instance-password" class="light-me-up" value="!GZGymlrL*09" placeholder="***********"/>
              <input type="submit" class="btn submit" value="Sign In" />
         
            </div>
          </form>
    </div>
</section>

`
export async function loginPage(ctx) {

  console.log('loginPage')
  ctx.render(loginPageTemplate(onSubmit));
  let mainContentEl = document.querySelector('.main-content')
  mainContentEl.style.background ='#546666'
  // console.log(mainContentEl)
  async function onSubmit(e) {
    e.preventDefault()
    console.log(credentials)

    console.log('click')
    let instanceName = document.querySelector('#instanceName').value.trim()
    let instanceUserName = document.querySelector('#instanceUserName').value.trim()
    let instancePassword = document.querySelector('#instance-password').value.trim()

    // Check for empty fields.
    if (instanceName.length == 0 || instanceUserName.length == 0 || instancePassword.length == 0) {
      alert('All fields are required!')
    }
    // All fields are filled up!
    else {
      credentials.instName = instanceName;
      credentials.instUserName = instanceUserName;
      credentials.instPassword = instancePassword;
      console.log(credentials)
      let btnSubmit = document.querySelector('.submit')
      console.log(btnSubmit)
      btnSubmit.disabled = true;
      btnSubmit.classList.add('no-hover')
      const myTimeout = setTimeout(warning, 3500);

      function warning() {

        document.querySelector(".error-msg").style.opacity = 1;
        let wrapper = document.querySelector('.login').classList.add('error-box')
        let btnSubmit = document.querySelector('.submit')
        btnSubmit.classList.remove('no-hover')

        btnSubmit.disabled = false;
        document.querySelector('#instanceUserName').value = ''
        document.querySelector('#instance-password').value = ''
      }
      let login = await snowConnection(instanceName, instanceUserName, instancePassword);
      // mainContentEl.style.background ='#e2eff2'
      console.log(login)
      if (login) {
        // mainContentEl.style.background ='rgb(226 239 242);'
        ctx.page.redirect('/projects')
      }
      else {
        warning();
      }
    }
  }
}






