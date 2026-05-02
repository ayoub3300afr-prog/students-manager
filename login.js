document.addEventListener('DOMContentLoaded', () => {
  /* ──────────────────────────────────────
     ROLE TABS
  ─────────────────────────────────────── */
  const roleTabs = document.querySelectorAll('.role-tab');

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ──────────────────────────────────────
     PASSWORD TOGGLE (show / hide)
  ─────────────────────────────────────── */
  const eyeBtn  = document.getElementById('eyeBtn');
  const eyeIcon = document.getElementById('eyeIcon');
  const pwInput = document.getElementById('password');

  eyeBtn.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type   = isHidden ? 'text' : 'password';
    eyeIcon.classList.toggle('fa-eye',      !isHidden);
    eyeIcon.classList.toggle('fa-eye-slash', isHidden);
  });

  /* ──────────────────────────────────────
     VALIDATION HELPERS
  ─────────────────────────────────────── */
  function showError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    group.classList.add('error', 'shake');
    error.textContent = message;
    setTimeout(() => group.classList.remove('shake'), 400);
  }

  function clearError(groupId, errorId) {
    document.getElementById(groupId).classList.remove('error');
    document.getElementById(errorId).textContent = '';
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* ──────────────────────────────────────
     LIVE VALIDATION (pendant la saisie)
  ─────────────────────────────────────── */
  document.getElementById('email').addEventListener('input', function () {
    if (this.value.trim() === '' || isValidEmail(this.value.trim())) {
      clearError('emailGroup', 'emailError');
    }
  });

  document.getElementById('password').addEventListener('input', function () {
    if (this.value.length >= 6) {
      clearError('passwordGroup', 'pwError');
    }
  });

  /* ──────────────────────────────────────
     SIGN IN — validation + redirect
  ─────────────────────────────────────── */
  const signInBtn = document.getElementById('signInBtn');

  function handleSignIn() {
    const emailVal = document.getElementById('email').value.trim();
    const pwVal    = document.getElementById('password').value;

    let valid = true;

    if (!emailVal) {
      showError('emailGroup', 'emailError', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError('emailGroup', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('emailGroup', 'emailError');
    }

    if (!pwVal) {
      showError('passwordGroup', 'pwError', 'Password is required.');
      valid = false;
    } else if (pwVal.length < 6) {
      showError('passwordGroup', 'pwError', 'Password must be at least 6 characters.');
      valid = false;
    } else {
      clearError('passwordGroup', 'pwError');
    }

    if (!valid) return;

    signInBtn.textContent = 'Signing in…';
    signInBtn.classList.add('loading');
    signInBtn.disabled = true;

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  signInBtn.addEventListener('click', handleSignIn);

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSignIn();
  });

  document.querySelector('.btn-google').addEventListener('click', () => {
    alert('Google Sign-In integration coming soon!');
  });

  /* ──────────────────────────────────────
     FORGOT PASSWORD (placeholder)
  ─────────────────────────────────────── */
  document.querySelector('.forgot-link').addEventListener('click', e => {
    e.preventDefault();
    alert('Password reset email will be sent to your inbox.');
  });

});
