function solve() {

  window.addEventListener('load', async function () {
    displayNavMenu();

    let createProductForm = document.querySelector('#CreateProductForm');
    if (createProductForm !== null) {
      createProductForm.addEventListener('submit', createProduct);
    }

    let buyButton = document.querySelector('#BuyButton');
    if (buyButton !== null) {
      buyButton.addEventListener('click', buyProducts);
    }

    let allOrdersButton = document.querySelector('.orders button');
    if (allOrdersButton !== null) {
      allOrdersButton.addEventListener('click', showAllOrders);
    }

    await loadAllFurnitures();
  });

  async function showAllOrders(event) {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3030/data/orders?where=_ownerId%3D"${getOwnerId()}"`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      let data = await response.json();

      let productNames = data.reduce((acc, c) => acc.concat(c.names), []).join(', ');
      let totalPrice = data.reduce((acc, c) => acc + Number(c.price), 0);
      
      event.target.parentNode.querySelector('#productNames').textContent = productNames;
      event.target.parentNode.querySelector('#productPrice').textContent = `${totalPrice} $`;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }

  }

  async function buyProducts(event) {
    event.preventDefault();

    let tableRows = document.querySelectorAll('.table tbody tr');
    let productsToBuy = [...tableRows]
          .filter(row => row.children[4].querySelector('input').checked)
          .map(row => {
            return {
              name: row.children[1].querySelector('p').textContent,
              price: row.children[2].querySelector('p').textContent,
              _ownerId: row.ownerId
            };
          });
          
    let products = {
      names: productsToBuy.map(p => p.name),
      price: productsToBuy.map(p => p.price).reduce((acc, c) => acc + Number(c), 0),
      _ownerId: productsToBuy[0]._ownerId
    };

    try {
      const response = await fetch('http://localhost:3030/data/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': getUserAuthToken()
        },
        body: JSON.stringify(products)
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      [...tableRows].forEach(row => {
        row.children[4].querySelector('input').checked = false;
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function createProduct(event) {
    event.preventDefault();
    if (!isUserLoggedIn()) {
      console.log('You must be logged in!');
      alert('You must be logged in!');
    }

    try {
      const formData = new FormData(event.target);
      let isAnyInputEmpty = [...formData].some(x => x[1] === '');
      if (isAnyInputEmpty) {
        alert('All field are required and cannot be empty!');
        return false;
      }
      let name = formData.get('name');
      let price = formData.get('price');
      let factor = formData.get('factor');
      let img = formData.get('img');

      if (isNaN(price) || isNaN(factor)) {
        console.log('Price and Factor must be numbers!');
        alert('Price and Factor must be numbers!');
      }

      const response = await fetch('http://localhost:3030/data/furniture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': getUserAuthToken()
        },
        body: JSON.stringify({
          name,
          price,
          factor,
          img
        })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      sessionStorage.setItem('ownerId', data._ownerId);
      
      await loadAllFurnitures();
      
      event.target.reset();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async function loadAllFurnitures() {
    let tableTBody = document.querySelector('.table tbody');
    tableTBody.innerHTML = '';

    if (tableTBody !== null) {
      try {
        const response = await fetch('http://localhost:3030/data/furniture');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
  
        let userLoggedIn = isUserLoggedIn();
        const data = await response.json();
        data.forEach(x => {
          let tr = e('tr', { ownerId: x._ownerId },
                       e('td', {},
                         e('img', { src: x.img })),
                       e('td', {},
                         e('p', {}, x.name)),
                       e('td', {},
                         e('p', {}, x.price)),
                       e('td', {},
                         e('p', {}, x.factor)),
                       e('td', {},
                         e('input', { type: 'checkbox' , disabled: !userLoggedIn })));
          tableTBody.appendChild(tr);
        });
       
  
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    }
  }

  function isUserLoggedIn() {
    return getUserAuthToken() !== null;
  }

  function getUserAuthToken() {
    return sessionStorage.getItem('authToken');
  }

  function getOwnerId() {
    return sessionStorage.getItem('ownerId');
  }

  function displayNavMenu() {
    let divUser = document.querySelector('#user');
    let divGuest = document.querySelector('#guest');

    if (isUserLoggedIn()) {
      divUser.style.display = 'inline-block';
      divGuest.style.display = 'none';
    } else {
      divUser.style.display = 'none';
      divGuest.style.display = 'inline-block';
    }
  }

  function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
      if (attr.substring(0, 2) == 'on') {
        result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
      } else {
        result[attr] = value;
      }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
      if (typeof e == 'string' || typeof e == 'number') {
        const node = document.createTextNode(e);
        result.appendChild(node);
      } else {
        result.appendChild(e);
      }
    });

    return result;
  }
}

solve();