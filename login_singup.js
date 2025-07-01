document.addEventListener('DOMContentLoaded', function () {
    const loginText = document.getElementById('loginText');
    const signupText = document.getElementById('signupText');
    const switchButton = document.getElementById('switchButton');
  
    function setSignupState() {
      signupText.classList.add('active');
      loginText.classList.remove('active');
      switchButton.style.left = '105px';
      switchButton.style.backgroundColor = 'var(--button-signup-color)';
    }
  
    function setLoginState() {
      loginText.classList.add('active');
      signupText.classList.remove('active');
      switchButton.style.left = '0px';
      switchButton.style.backgroundColor = 'var(--button-login-color)';
    }
  
    loginText.addEventListener('click', function () {
      setLoginState();
      window.location.href = 'login.html';
    });
  
    signupText.addEventListener('click', function () {
      setSignupState();
      window.location.href = 'signup.html';
    });
  
    if (window.location.href.includes('signup.html')) {
      setSignupState();
    } else {
      setLoginState();
    }
  });
  