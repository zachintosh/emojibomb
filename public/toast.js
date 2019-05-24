function toast(message) {
  const toaster = document.getElementById('toaster')
  toaster.textContent = message
  toaster.classList.add('toast-anim')
  toaster.addEventListener('animationend', e => {
    toaster.classList.remove('toast-anim')
  }, { once: true })
}