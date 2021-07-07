const headerCityBtn = document.querySelector(".header__city-button");
const headerCityInpt = document.querySelector(".header__city-input");
const headerCityForm = document.querySelector(".header__city-form");
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

headerCityBtn.textContent = localStorage.getItem('lamoda-location') || "Ваш город?";

const toggleCityForm = () => {
  headerCityBtn.classList.toggle("d-none");
  headerCityForm.classList.toggle("d-none");
};
const cartModalOpen = () => cartOverlay.classList.add('cart-overlay-open');
const cartModalClose = () => cartOverlay.classList.remove('cart-overlay-open');
const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dbScrollY = window.scrollY;
  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `;
};
const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({ top: document.body.dbScrollY });
};



document.body.addEventListener('click', e => {
  const targ = e.target;

  if (targ === headerCityBtn) toggleCityForm();

  if (targ === subheaderCart) { cartModalOpen(); disableScroll(); }

  if ((targ.classList.contains('cart-overlay-open') || targ.classList.contains('cart__btn-close')) 
    && cartOverlay.classList.contains('cart-overlay-open')) {
    cartModalClose();
    enableScroll();
  }
});

document.body.addEventListener('submit', e => {
  e.preventDefault();
  const targ = e.target;

  if (targ === headerCityForm) {
    localStorage.setItem('lamoda-location', headerCityInpt.value);
    toggleCityForm();
    headerCityInpt.value = "";
  }
});
