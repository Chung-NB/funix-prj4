// javascript cart page

// mobile navigator
let mobileNavList = document.querySelectorAll('header .nav__mobile .nav__mobile--list > ul .mobileNavList');
let mobileNavList_subnav = document.querySelectorAll('header .nav__mobile .nav__mobile--list > ul .nav__mobile--subnav');
let mobileNavList_icon = document.querySelectorAll('header .nav__mobile .nav__mobile--list > ul .fas');

for(let i in mobileNavList) {
    mobileNavList[i].onclick = (e) => {
        mobileNavList_subnav[i].classList.toggle('block');
        mobileNavList_subnav[i].classList.toggle('hidden');

        mobileNavList_icon[i].classList.toggle('fa-angle-down');
        mobileNavList_icon[i].classList.toggle('fa-angle-up');
    }
}

let mobileNavCheckbox = document.querySelector('header .nav__mobile #nav__mobile--checkbox');
let mobileNav = document.querySelector('header .nav__mobile .nav__mobile--list');
let mobileNavCover = document.querySelector('header .nav__mobile .nav__mobile--cover');

mobileNavCheckbox.onchange = (e) => {
    mobileNav.classList.toggle('subnav-hidden');
    mobileNav.classList.toggle('subnav-appear');

    mobileNavCover.classList.toggle('cover-hidden');
    mobileNavCover.classList.toggle('cover-appear');
}

let mobileSearchInput = document.querySelector('header .nav__mobile .search__input');
let mobileSearchButton = document.querySelector('header .nav__mobile .search-button');

mobileSearchButton.onclick = () => {
    mobileSearchInput.classList.toggle('search-hidden');
    mobileSearchInput.classList.toggle('search-appear');
}

// call api
let categoriesApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/categories')
    .then(response => response.json());
let brandsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/brands')
    .then(response => response.json());
let productsSpecsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/product_specifications')
    .then(response => response.json());
let productsDescriptionsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/product_descriptions')
    .then(response => response.json());

// load products data from local storage
Promise.all([productsSpecsApi, brandsApi, categoriesApi])
    .then(([productsSpecs, brands, categories]) => {
        let productsInCartId = Object.keys(localStorage);
        
        let productsInCartData = getProductsFromIds(productsInCartId, productsSpecs);
        let totalPrice = productsInCartData.reduce((initPrice, currentProduct) => {
            return initPrice + Number(currentProduct.product_price.replaceAll(",",""));
        }, 0)

        // load number of products in cart and total price
        let productCountDisplayBlock = document.querySelectorAll('header .searchBlock__icons__productCount');
        let totalPriceDisplayBlock = document.querySelector('header .searchBlock .searchBlock__icons .totalPrice');
        productCountDisplayBlock[0].innerText = productsInCartId.length;
        productCountDisplayBlock[1].innerText = productsInCartId.length;
        totalPriceDisplayBlock.innerText = `$${totalPrice}.00`; 

        // render products data
        let productsInCartDisplayBlock = document.querySelector('section .section__products .product--display');
        let productsInCartDisplayValue = productsInCartData.map(product => {
            let productPrice = Number(product.product_price.replaceAll(",",""));
            let productSalePrice = Number(product.product_saleprice.replaceAll(",",""));
            let salePercentage = ((productPrice - productSalePrice)*100/productPrice).toFixed(0);
            // console.log(salePercentage);
            return `
                <div class="productInCart">
                    <img src="../../assets/images/products/summary/${product.product_id}-1.png" alt="Product Image">
                    <p class="productName">${product.product_name}</p>
                    <p class="productPrice">$${product.product_saleprice}<span class="price">$${product.product_price}</span><span class="percentage">-${salePercentage}%</span></p>
                    <div>
                        <input type="text" value="1">
                        <button class="up"><i class="fas fa-caret-up"></i></button>
                        <button class="down"><i class="fas fa-caret-down"></i></button>
                    </div>
                    <p class="totalPrice">$${productSalePrice}.00</p>
                    <p><i class="fas fa-times-circle ${product.product_id}"></i></p>
                </div>
            `
        })
        productsInCartDisplayBlock.innerHTML = productsInCartDisplayValue.join('');
    })

function getProductsFromIds(productsInCartId, productsSpecs) {
    let productsInCartData = productsInCartId.map(productId => {
        let product = productsSpecs.find(product => {
            return product.product_id === productId;
        })

        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_saleprice: product.product_saleprice,
            product_price: product.product_price,
        }
    })

    return productsInCartData;
}

// increase & decrease product quantity by buttons
setTimeout(() => {
    let productNumberUpButton = document.querySelectorAll('section .section__products .product--display .productInCart .up');
    let productNumberDownButton = document.querySelectorAll('section .section__products .product--display .productInCart .down');
    let productNumberDisplayBlock = document.querySelectorAll('section .section__products .product--display .productInCart input');
    
    for(let i in productNumberUpButton) {
        productNumberUpButton[i].onclick = e => {
            let productNumberDisplayValue = productNumberDisplayBlock[i].value;
            productNumberDisplayValue = Number(productNumberDisplayValue) + 1;
            productNumberDisplayBlock[i].value = `${productNumberDisplayValue}`;
        }
    }

    for(let i in productNumberDownButton) {
        productNumberDownButton[i].onclick = e => {
            let productNumberDisplayValue = productNumberDisplayBlock[i].value;
            if(Number(productNumberDisplayValue) > 1) {
                productNumberDisplayValue = Number(productNumberDisplayValue) - 1;
                productNumberDisplayBlock[i].value = `${productNumberDisplayValue}`;
            }
            else {
                productNumberDisplayBlock[i].value = 1;
            }
        }
    }
}, 1000)

// get subtotal & total price => render in Cart Totals display block
setTimeout(() => {
    let productsTotalPriceDisplayBlocks = document.querySelectorAll('section .section__products .product--display .productInCart .totalPrice');
    let cartTotalSubTotalDisplayBlock = document.querySelector('section .section__products .product--summary .subtotal');
    let cartTotalPriceDisplayBlock = document.querySelector('section .section__products .product--summary .totalPrice');

    let subtotalPrice = 0;
    for(let i = 0; i < productsTotalPriceDisplayBlocks.length; i++) {
        subtotalPrice += Number(productsTotalPriceDisplayBlocks[i].innerText.replaceAll("$",''));
    }
    cartTotalSubTotalDisplayBlock.innerText = `$${subtotalPrice}.00`;

    let totalPrice = subtotalPrice + 20;
    cartTotalPriceDisplayBlock.innerText = `$${totalPrice}.00`;
}, 1000)

// delete products in cart
setTimeout(() => {
    let productDeleteButtons = document.querySelectorAll('section .section__products .product--display .fa-times-circle');
    let productDisplayBlock = document.querySelectorAll('section .section__products .product--display .productInCart');
    
    for(let i in productDeleteButtons) {
        productDeleteButtons[i].onclick = e => {
            // console.log(e.target.classList[2]);
            localStorage.removeItem(e.target.classList[2]);
            productDisplayBlock[i].remove();
        }
    }
}, 1000)

// update cart button
setTimeout(() => {
    let updateCartButton = document.querySelector('section .section__products .product--buttons .update');
    
    updateCartButton.onclick = e => {
        // reset product number & total price
        let productCountDisplayBlock = document.querySelectorAll('header .searchBlock__icons__productCount');
        let totalPriceDisplayBlock = document.querySelector('header .totalPrice');

        let productNumberDisplayBlocks = document.querySelectorAll('section .section__products .product--display .productInCart > div > input');
        let productsTotalPriceDisplayBlocks = document.querySelectorAll('section .section__products .product--display .productInCart .totalPrice');
        let cartTotalSubTotalDisplayBlock = document.querySelector('section .section__products .product--summary .subtotal');
        let cartTotalPriceDisplayBlock = document.querySelector('section .section__products .product--summary .totalPrice');

        let subtotalPriceForEach = document.querySelectorAll('section .section__products .product--display .productInCart .totalPrice');
        let subTotalInitPriceForEach = []

        subtotalPriceForEach.forEach(price => {
            subTotalInitPriceForEach.push(Number(price.innerText.replaceAll("$","")));
        })
        console.log(subTotalInitPriceForEach);

        let cartTotalPriceDisplayValue = 0;

        let productNumberDisplayValue = 0;
        let productsTotalPriceDisplayValue = 0;
        
        for(let i = 0; i < productNumberDisplayBlocks.length; i++) {
            productNumberDisplayValue += Number(productNumberDisplayBlocks[i].value);
            productsTotalPriceDisplayValue += productNumberDisplayBlocks[i].value * Number(productsTotalPriceDisplayBlocks[i].innerText.replaceAll("$",""));

            
            let subtotalPrice = productNumberDisplayBlocks[i].value * subTotalInitPriceForEach[i];
            subtotalPriceForEach[i].innerText = `$${subtotalPrice}.00`;
        }

        cartTotalPriceDisplayValue = productsTotalPriceDisplayValue + 20;

        productCountDisplayBlock[0].innerText = `${productNumberDisplayValue}`;
        productCountDisplayBlock[1].innerText = `${productNumberDisplayValue}`;

        totalPriceDisplayBlock.innerText = `$${productsTotalPriceDisplayValue}.00`;

        cartTotalSubTotalDisplayBlock.innerText = `$${productsTotalPriceDisplayValue}.00`
        cartTotalPriceDisplayBlock.innerText = `$${cartTotalPriceDisplayValue}.00`
    }
}, 1000)

// continue shopping
let continueShoppingButton = document.querySelector('section .section__products .product--buttons .continueShopping');
continueShoppingButton.onclick = e => {
    window.location.href = '../../index.html';
}

// verify signup email
let emailSignUpButton = document.querySelector('footer .footer__signupForm .submit button');

emailSignUpButton.addEventListener('click', e => {
    let emailSignUpBlock = document.querySelector('footer .footer__signupForm .submit input');
    let emailSignUpValue = emailSignUpBlock.value;
    let testEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(emailSignUpValue === null || emailSignUpValue === '' || !testEmail.test(emailSignUpValue)) {
        alert('Please check again your email address');
    }
    else {
        alert(`You have successfully signed up with email address "${emailSignUpValue}", please check and verify your email.`);
        emailSignUpBlock.value = '';
    }
})