const headerCityBtn = document.querySelector(".header__city-button");
const headerCityInpt = document.querySelector(".header__city-input");
const headerCityForm = document.querySelector(".header__city-form");
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartListGoods = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost');
let locationHashCode = location.hash.substring(1);

headerCityBtn.textContent = localStorage.getItem('lamoda-location') || "Ваш город?";

const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lamoda')) || [];
const setLocalStorage = data => localStorage.setItem('cart-lamoda', JSON.stringify(data));
const toggleCityForm = () => {
  headerCityBtn.classList.toggle("d-none");
  headerCityForm.classList.toggle("d-none");
};
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
const cartModalOpen = () => { 
  cartOverlay.classList.add('cart-overlay-open');
  renderCart();
  disableScroll();
}

const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
  enableScroll();
}

const togglerAddToCartBTN = cardBTN => {
  cardBTN.classList.add('delete');
  cardBTN.textContent = 'Удалить из корзины';
}

const deleteItemCart = id => {
  const cartItems = getLocalStorage();
  const newCartItems = cartItems.filter(item => item.id !== id);
  setLocalStorage(newCartItems);
}

const renderCart = () => {
  cartListGoods.textContent = '';

  const cartItems = getLocalStorage();

  let totalPrice = 0;

  cartItems.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML =`
      <td>${i+1}</td>
      <td>${item.brand} ${item.name}</td>
      ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
      ${item.sizes ? `<td>${item.sizes}</td>` : '<td>-</td>'}
      <td>${item.cost} &#8381;</td>
      <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
    `;
    totalPrice += item.cost;
    cartListGoods.append(tr);
  });

  cartTotalCost.textContent = totalPrice+"₽";
}

const getData = async () => {
  const data = await fetch('db.json');
  if (data.ok) return data.json();
  else throw new Error(`Данные не были получены, ошибка: ${data.status} ${data.statusText}`);
};

const getItemsForSale = (callback, prop, value) => {
  getData()
    .then(data => { if (value) callback(data.filter(item => item[prop] === value)); else callback(data); })
    .catch(err => console.error(err));
};

// category pages
try {
  const itemsList = document.querySelector('.goods__list');

  if (!itemsList) throw "";

  const createCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement('li');
    li.classList.add('goods__item');

    const sizesP = `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes ? sizes.join(" ") : ""}</span></p>`;

    li.innerHTML = `
      <article class="good">
          <a class="good__link-img" href="card-good.html#${id}">
              <img class="good__img" src="goods-image/${preview}" alt="${preview}">
          </a>
          <div class="good__description">
              <p class="good__price">${cost} &#8381;</p>
              <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
              ${sizes
                ? sizesP
                : ''
              }
              <a class="good__link" href="card-good.html#${id}">Подробнее</a>
          </div>
      </article>
    `;

    return li;
  };

  const renderItemsList = data => {
    itemsList.textContent = '';

    data.forEach(item => {
      const card = createCard(item);
      itemsList.append(card);
    });
  };

  getItemsForSale(renderItemsList, 'category', locationHashCode);

  window.addEventListener('hashchange', () => {
    locationHashCode = location.hash.substring(1);
    getItemsForSale(renderItemsList, 'category', locationHashCode);
  });
  
} 
catch (err) { console.warn(err); }

// item page
try {
  if (!document.querySelector('.card-good')) throw "";

  const cardGoodImage = document.querySelector('.card-good__image');
  const cardGoodBrand = document.querySelector('.card-good__brand');
  const cardGoodTitle = document.querySelector('.card-good__title');
  const cardGoodPrice = document.querySelector('.card-good__price');
  const cardGoodColor = document.querySelector('.card-good__color');
  const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
  const cardGoodColorList = document.querySelector('.card-good__color-list');
  const cardGoodSizes = document.querySelector('.card-good__sizes');
  const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
  const cardGoodBuyBTN = document.querySelector('.card-good__buy');

  const generateList = arr => arr.reduce((htmlOutput, item, i) => htmlOutput+`<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');
  const renderItemCard = ([ { id, brand, name, cost, color, sizes, photo } ]) => {
    const data = { brand, name, cost, id };
    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;

    
    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    }
    else cardGoodColor.style.display = "none";
    
    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodColor.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    }
    else cardGoodSizes.style.display = "none";

    if (getLocalStorage().some(item => item.id === id)) togglerAddToCartBTN(cardGoodBuyBTN);

    cardGoodBuyBTN.addEventListener('click', () => {
      if (cardGoodBuyBTN.classList.contains('delete')) {
        deleteItemCart(id);
        cardGoodBuyBTN.classList.remove('delete');
        cardGoodBuyBTN.textContent = 'Добавить в корзину';
        return;
      }
      togglerAddToCartBTN(cardGoodBuyBTN);

      if (color) data.color = cardGoodColor.textContent;
      if (sizes) data.sizes = cardGoodSizes.textContent;
      const cardData = getLocalStorage();
      cardData.push(data);
      setLocalStorage(cardData);
    });
  };

  cardGoodSelectWrapper.forEach(item => {
    item.addEventListener('click', e => {
      const targ = e.target;
      
      if (targ.closest('.card-good__select-item')) {
        const cardGoodSelect = item.querySelector('.card-good__select');
        cardGoodSelect.textContent = targ.textContent;
        cardGoodSelect.dataset.id = targ.dataset.id;
        cardGoodSelect.classList.toggle('card-good__select__open');
      }

      
    });
  });

  getItemsForSale(renderItemCard, 'id', locationHashCode);
}
catch (err) { console.warn(err); }

document.body.addEventListener('click', e => {
  const targ = e.target;

  if (targ === headerCityBtn) toggleCityForm();
  if (targ === subheaderCart) cartModalOpen();
  
  if (targ.classList.contains("btn-delete")) { 
    deleteItemCart(targ.dataset.id);
    renderCart();
  }

  if (targ.classList.contains("navigation__link")) {
    const goodsTitle = document.querySelector(".goods__title");
    if (goodsTitle) goodsTitle.textContent = targ.textContent;
  }

  if (targ.closest('.card-good__select')) {
    targ.classList.toggle('card-good__select__open');
  }

  if ((targ.classList.contains('cart-overlay-open') || targ.classList.contains('cart__btn-close')) 
    && cartOverlay.classList.contains('cart-overlay-open')) cartModalClose();
});

document.body.addEventListener('submit', e => {
  e.preventDefault();
  const targ = e.target;

  if (targ === headerCityForm) {
    localStorage.setItem('lamoda-location', headerCityInpt.value);
    headerCityBtn.textContent = headerCityInpt.value;
    toggleCityForm();
    headerCityInpt.value = "";
  }
});
