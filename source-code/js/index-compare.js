// javascript comparing page

// header
// product count
let productCount = document.querySelectorAll('header .searchBlock__icons__productCount');
// console.log(productCount);
productCount[0].innerText = '0';
productCount[1].innerText = '0';

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

// get searching keyword and switch to searching.html with query string k
let searchDisplayBlock = document.querySelector('header .searchBlock input.search__input');
let searchButton = document.querySelector('header .searchBlock .searchIcon');

searchDisplayBlock.addEventListener('keydown', (e) => {
    if(e.which === 13 && e.target.value !== '') {
        window.location.href = `./searching.html?c=&b=&k=${e.target.value}`;
    }
})

searchButton.addEventListener('click', (e) => {
    if(searchDisplayBlock.value !== '') {
        window.location.href = `./searching.html?c=&b=&k=${searchDisplayBlock.value}`;
    }
})

// get query strings
function getParameterByName(name) {
    var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
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

// render products on add comparing product
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsDescriptionsApi])
    .then(([categories, brands, productsSpecs, productsDescriptions]) => {
        // get query strings
        let product_id = getParameterByName('p');
        // define blocks
        let inputBlock1 = document.querySelector('section .section__product .product--2 .inputValue');
        let addProductDisplayBlock1 = document.querySelector('section .section__product .product--2 .showAddProduct'); 
        let inputBlock2 = document.querySelector('section .section__product .product--3 .inputValue');
        let addProductDisplayBlock2 = document.querySelector('section .section__product .product--3 .showAddProduct'); 
        let initProductTitleDisplayBlock = document.querySelector('section .section__product .product--1');
        let initProductSpecsDisplayBlock = document.querySelector('section .section__specs .specs--1');
        // get product, category & brand
        let productInit = productsSpecs.find(product => {
            return product.product_id === product_id;
        })
        let productInitCategory = categories.find(cat => {
            return cat.cat_id === productInit.cat_id;
        })
        let productInitBrand = brands.find(brand => {
            return brand.brand_id === productInit.brand_id;
        })
        // render init product title
        let initProductTitleDisplayValue = [{
            product_id: productInit.product_id,
            product_name: productInit.product_name,
            product_saleprice: productInit.product_saleprice
        }]
        let initProductTitleDisplayValueFinal = initProductTitleDisplayValue.map(value => {
            return `
                <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Image">
                <p class="name">${value.product_name}</p>
                <p class="saleprice">$${value.product_saleprice}</p>
                <p class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </p>
            `
        })
        initProductTitleDisplayBlock.innerHTML = initProductTitleDisplayValueFinal.join('');
        // render init product specs
        let initProductSpecsDisplayValue = [{
            product_brand: productInitBrand.brand_name,
            product_id: productInit.product_id,
            product_name: productInit.product_name,
            product_price: productInit.product_price,
            product_saleprice: productInit.product_saleprice,
            product_inventory: productInit.product_inventory,
            product_display: productInit.product_display,
            product_ram: productInit.product_ram,
            product_rom: productInit.product_rom,
            product_battery: productInit.product_battery
        }]
        let initProductSpecsDisplayValueFinal = initProductSpecsDisplayValue.map(value => {
            return `
                <p><span>Product Name:</span>${value.product_name}</p>
                <p><span>Brand Name:</span>${value.product_brand}</p>
                <p><span>Product Price:</span>$${value.product_price}</p>
                <p><span>Sale Price:</span>$${value.product_saleprice}</p>
                <p><span>Inventory:</span>${value.product_inventory}</p>
                <p><span>Display Resolution:</span>${value.product_display}</p>
                <p><span>Product Ram:</span>${value.product_ram}</p>
                <p><span>Product Rom:</span>${value.product_rom}</p>
                <p><span>Product Battery:</span>${value.product_battery}</p>
            `
        })
        initProductSpecsDisplayBlock.innerHTML = initProductSpecsDisplayValueFinal.join('');
        // render products same category
        let displayValueInit = productsSpecs.filter(product => {
            return product.cat_id === productInit.cat_id;
        })
        inputBlock1.addEventListener('input', (e) => {
            // get input keyword
            let displayValue = displayValueInit.filter(value => {
                return value.product_name.toLowerCase().includes(e.target.value.toLowerCase());
            })
            let displayValueFinal = displayValue.map(value => {
                return `
                    <div class="${value.product_id}">
                        <p>${value.product_name}</p>
                        <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Image">
                    </div>
                `
            })
            // render products
            if(displayValue !== []) {
                addProductDisplayBlock1.innerHTML = displayValueFinal.join('');
            }
            // event onclick to render chosen add product
            let addProductList1 = document.querySelectorAll('section .section__product .product--2 .showAddProduct div');
            // console.log(addProductList1);
            for(let i in addProductList1) {
                addProductList1[i].onclick = e => {
                    // console.log(addProductList[i]);
                    let addProduct1_id = addProductList1[i].className;
                    // console.log(addProduct1_id);
                    // define display block
                    let addProductTitleDisplayBlockFinal1 = document.querySelector('section .section__product .product--2');
                    let addProductSpecsDisplayBlockFinal1 = document.querySelector('section .section__specs .specs--2');
                    // find product & price from product_id
                    let addproductFinal1 = productsSpecs.find(product => {
                        return product.product_id === addProduct1_id;
                    })
                    let addBrandFinal1 = brands.find(brand => {
                        return brand.brand_id === addproductFinal1.brand_id;
                    })
                    // render init product title
                    let addProductTitleDisplayValue1 = [{
                        product_id: addProduct1_id,
                        product_name: addproductFinal1.product_name,
                        product_saleprice: addproductFinal1.product_saleprice
                    }]
                    let addProductTitleDisplayValueFinal1 = addProductTitleDisplayValue1.map(value => {
                        return `
                            <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Image">
                            <p class="name">${value.product_name}</p>
                            <p class="saleprice">$${value.product_saleprice}</p>
                            <p class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </p>
                        `
                    })
                    addProductTitleDisplayBlockFinal1.innerHTML = addProductTitleDisplayValueFinal1.join('');
                    
                    // render add product specs
                    let addProductSpecsDisplayValue1 = [{
                        product_brand: addBrandFinal1.brand_name,
                        product_id: addproductFinal1.product_id,
                        product_name: addproductFinal1.product_name,
                        product_price: addproductFinal1.product_price,
                        product_saleprice: addproductFinal1.product_saleprice,
                        product_inventory: addproductFinal1.product_inventory,
                        product_display: addproductFinal1.product_display,
                        product_ram: addproductFinal1.product_ram,
                        product_rom: addproductFinal1.product_rom,
                        product_battery: addproductFinal1.product_battery
                    }]
                    let addProductSpecsDisplayValueFinal1 = addProductSpecsDisplayValue1.map(value => {
                        return `
                            <p><span>Product Name:</span>${value.product_name}</p>
                            <p><span>Brand Name:</span>${value.product_brand}</p>
                            <p><span>Product Price:</span>$${value.product_price}</p>
                            <p><span>Sale Price:</span>$${value.product_saleprice}</p>
                            <p><span>Inventory:</span>${value.product_inventory}</p>
                            <p><span>Display Resolution:</span>${value.product_display}</p>
                            <p><span>Product Ram:</span>${value.product_ram}</p>
                            <p><span>Product Rom:</span>${value.product_rom}</p>
                            <p><span>Product Battery:</span>${value.product_battery}</p>
                        `
                    })
                    addProductSpecsDisplayBlockFinal1.innerHTML = addProductSpecsDisplayValueFinal1.join('');
                }
            }
        })
        inputBlock2.addEventListener('input', (e) => {
            let displayValue = displayValueInit.filter(value => {
                return value.product_name.toLowerCase().includes(e.target.value.toLowerCase());
            })
            // console.log(displayValue);
            let displayValueFinal = displayValue.map(value => {
                return `
                    <div class="${value.product_id}">
                        <p>${value.product_name}</p>
                        <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Image">
                    </div>
                `
            })
            if(displayValue !== []) {
                addProductDisplayBlock2.innerHTML = displayValueFinal.join('');
            }
            // event onclick to render chosen add product
            let addProductList2 = document.querySelectorAll('section .section__product .product--3 .showAddProduct div');
            // console.log(addProductList2);
            for(let i in addProductList2) {
                addProductList2[i].onclick = e => {
                    let addProduct2_id = addProductList2[i].className;
                    // console.log(addProduct2_id);
                    // define display block
                    let addProductTitleDisplayBlockFinal2 = document.querySelector('section .section__product .product--3');
                    let addProductSpecsDisplayBlockFinal2 = document.querySelector('section .section__specs .specs--3');
                    // find product & price from product_id
                    let addproductFinal2 = productsSpecs.find(product => {
                        return product.product_id === addProduct2_id;
                    })
                    let addBrandFinal2 = brands.find(brand => {
                        return brand.brand_id === addproductFinal2.brand_id;
                    })
                    // render init product title
                    let addProductTitleDisplayValue2 = [{
                        product_id: addProduct2_id,
                        product_name: addproductFinal2.product_name,
                        product_saleprice: addproductFinal2.product_saleprice
                    }]
                    let addProductTitleDisplayValueFinal2 = addProductTitleDisplayValue2.map(value => {
                        return `
                            <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Image">
                            <p class="name">${value.product_name}</p>
                            <p class="saleprice">$${value.product_saleprice}</p>
                            <p class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </p>    
                        `
                    })
                    addProductTitleDisplayBlockFinal2.innerHTML = addProductTitleDisplayValueFinal2.join('');
                    
                    // render add product specs
                    let addProductSpecsDisplayValue2 = [{
                        product_brand: addBrandFinal2.brand_name,
                        product_id: addproductFinal2.product_id,
                        product_name: addproductFinal2.product_name,
                        product_price: addproductFinal2.product_price,
                        product_saleprice: addproductFinal2.product_saleprice,
                        product_inventory: addproductFinal2.product_inventory,
                        product_display: addproductFinal2.product_display,
                        product_ram: addproductFinal2.product_ram,
                        product_rom: addproductFinal2.product_rom,
                        product_battery: addproductFinal2.product_battery
                    }]
                    let addProductSpecsDisplayValueFinal2 = addProductSpecsDisplayValue2.map(value => {
                        return `
                            <p><span>Product Name:</span>${value.product_name}</p>
                            <p><span>Brand Name:</span>${value.product_brand}</p>
                            <p><span>Product Price:</span>$${value.product_price}</p>
                            <p><span>Sale Price:</span>$${value.product_saleprice}</p>
                            <p><span>Inventory:</span>${value.product_inventory}</p>
                            <p><span>Display Resolution:</span>${value.product_display}</p>
                            <p><span>Product Ram:</span>${value.product_ram}</p>
                            <p><span>Product Rom:</span>${value.product_rom}</p>
                            <p><span>Product Battery:</span>${value.product_battery}</p>
                        `
                    })
                    addProductSpecsDisplayBlockFinal2.innerHTML = addProductSpecsDisplayValueFinal2.join('');
                }
            }
        })
    })

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