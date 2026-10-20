/* ===== Ubay-Ubay | script.js ===== */

document.addEventListener('DOMContentLoaded', () => {
  // Test mode flag - change to false when ready for real submissions
  const TEST_MODE = true;

  // 1. Signature Pad Initialization
  const canvas = document.getElementById('signature-pad');
  if (canvas) {
    const signaturePad = new SignaturePad(canvas, {
      penColor: '#2b2c49', // Dark navy ink matching theme
      minWidth: 1.5,
      maxWidth: 3.5
    });

    // Resize canvas properly for high-DPI displays
    function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      signaturePad.clear();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Clear signature button handler
    const clearButton = document.getElementById('signature-clear');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        signaturePad.clear();
      });
    }

    // Form submission handling
    const form = document.getElementById('acceptance-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation checks
        let isValid = true;
        const fullNameInput = document.getElementById('full-name');
        const artistNameInput = document.getElementById('artist-name');
        const emailInput = document.getElementById('email');
        const socialInput = document.getElementById('social');
        const agreeCheckbox = document.getElementById('agree');

        // Clear previous error messages
        document.querySelectorAll('.field-error').forEach(el => el.textContent = '');

        if (!fullNameInput.value.trim()) {
          document.getElementById('full-name-error').textContent = 'Please enter your full name.';
          isValid = false;
        }
        if (!artistNameInput.value.trim()) {
          document.getElementById('artist-name-error').textContent = 'Please enter your artist name.';
          isValid = false;
        }
        if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
          document.getElementById('email-error').textContent = 'Please enter a valid email address.';
          isValid = false;
        }
        if (!socialInput.value.trim()) {
          document.getElementById('social-error').textContent = 'Please enter your social handle.';
          isValid = false;
        }
        if (!agreeCheckbox.checked) {
          document.getElementById('agree-error').textContent = 'You must agree to the terms to proceed.';
          isValid = false;
        }
        if (signaturePad.isEmpty()) {
          document.getElementById('signature-error').textContent = 'Please provide your signature.';
          isValid = false;
        }

        if (!isValid) return;

        // Set date signed hidden field
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('date-signed').value = now.toLocaleDateString('en-US', options);

        // Success state UI toggle
        form.hidden = true;
        const doneBox = document.getElementById('signup-done');
        if (doneBox) {
          doneBox.hidden = false;
          doneBox.querySelector('[data-done="email"]').textContent = emailInput.value;
          doneBox.querySelector('[data-done="fullName"]').textContent = fullNameInput.value;
          doneBox.querySelector('[data-done="artistName"]').textContent = artistNameInput.value;
          doneBox.querySelector('[data-done="social"]').textContent = socialInput.value;
          doneBox.querySelector('[data-done="dateSigned"]').textContent = document.getElementById('date-signed').value;
        }

        // Show thank you modal dialog if available
        const thanksDialog = document.getElementById('thanks-dialog');
        if (thanksDialog && typeof thanksDialog.showModal === 'function') {
          thanksDialog.showModal();
        }
      });
    }
  }
});