// javascript searching page

// header
// product count
let productCount = document.querySelectorAll('header .searchBlock__icons__productCount');
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

// hide and show ul all category
let allCategoryButton = document.querySelector('section .section__master .master--1 .nav > p');
let allCategoryDisplayBlock = document.querySelector('section .section__master .master--1 .nav > ul');
let allCategoryIcon = document.querySelector('section .section__master .master--1 .fas');

allCategoryButton.addEventListener('click', (e) => {
    allCategoryIcon.classList.toggle('fa-chevron-down');
    allCategoryIcon.classList.toggle('fa-chevron-up');

    allCategoryDisplayBlock.classList.toggle('hideAllCategory');
    allCategoryDisplayBlock.classList.toggle('showAllCategory');
})

// call api
let categoriesApi = fetch('http://localhost:3000/categories')
    .then(response => response.json());
let brandsApi = fetch('http://localhost:3000/brands')
    .then(response => response.json());
let productsSpecsApi = fetch('http://localhost:3000/product_specifications')
    .then(response => response.json());
let productsDescriptionsApi = fetch('http://localhost:3000/product_descriptions')
    .then(response => response.json());

// render searching keyword on breadcrumbs
Promise.all([categoriesApi, brandsApi])
    .then(([categories, brands] )=> {
        // get query strings
        let searchingKeywordDisplayBlock = document.querySelector('section .section__breadcrumbs .keyword-breadcrumb');
        let titleDisplayBlock = document.querySelector('section .section__master .master--2 .master--2__title');
        let searching_category = getParameterByName('c');
        let searching_brand = getParameterByName('b');
        let searching_keyword = getParameterByName('k');

        // search for category name
        let cat = categories.find(cat => {
            return cat.cat_id === searching_category;
        })

        let brand = brands.find(brand => {
            return brand.brand_id === searching_brand;
        })
        
        // render
        if(searching_category === '' && searching_brand === '') {
            searchingKeywordDisplayBlock.innerText = `Search results for "${searching_keyword}"`;
            titleDisplayBlock.innerText = `Search results for "${searching_keyword}"`;
        }
        else if(searching_brand === '' && searching_keyword === '') {
            searchingKeywordDisplayBlock.innerText = `Search results for "${cat.cat_name}"`;
            titleDisplayBlock.innerText = `Search results for "${cat.cat_name}"`;
        }
        else {
            searchingKeywordDisplayBlock.innerText = `Search results for "${brand.brand_name}"`;
            titleDisplayBlock.innerText = `Search results for "${brand.brand_name}"`;
        }
    })

// get and render searching results show1 - show2
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsDescriptionsApi])
    .then(([categories, brands, productsSpecs, productsDescriptions]) => {
        // get query strings
        let searching_category = getParameterByName('c');
        // console.log(typeof  searching_category);
        let searching_brand = getParameterByName('b');
        // console.log(typeof  searching_brand);
        let searching_keyword = getParameterByName('k');
        // console.log(typeof searching_keyword);
        
        // get datas
        if(searching_category === '' && searching_brand === '') {
            let results = productsSpecs.filter((product) => {
                // console.log(typeof product.product_name);
                return product.product_name.toLowerCase().includes(searching_keyword.toLowerCase());
            })
            
            let displayValue = results.map((result) => {
                let brand = brands.find((brand) => {
                    return brand.brand_id === result.brand_id;
                })
                let category = categories.find((cat) => {
                    return cat.cat_id === result.cat_id;
                })
                return {
                    product_id: result.product_id,
                    product_name: result.product_name,
                    product_price: result.product_price,
                    product_salePrice: result.product_saleprice,
                    product_imageLink: `../../assets/images/products/summary/${result.product_id}-1.png`,
                    product_brand: brand.brand_name,
                    product_cat: category.cat_name
                }
            })
            return new Promise(resolve => {
                resolve(displayValue);
            })
        }
        else if(searching_keyword === '' &&  searching_brand === '') {
            let results = productsSpecs.filter((product) => {
                return product.cat_id === searching_category;
            })

            let displayValue = results.map((result) => {
                let brand = brands.find((brand) => {
                    return brand.brand_id === result.brand_id;
                })
                let category = categories.find((cat) => {
                    return cat.cat_id === result.cat_id;
                })
                let descriptions = productsDescriptions.find((product) => {
                    return product.product_id === result.product_id;
                })
                return {
                    product_id: result.product_id,
                    product_name: result.product_name,
                    product_price: result.product_price,
                    product_salePrice: result.product_saleprice,
                    product_descriptions: descriptions.product_descriptions,
                    product_imageLink: `../../assets/images/products/summary/${result.product_id}-1.png`,
                    product_brand: brand.brand_name,
                    product_cat: category.cat_name
                }
            })
            return new Promise(resolve => {
                resolve(displayValue);
            })
        }
        else if(searching_keyword === '' &&  searching_category === '') {
            let results = productsSpecs.filter((product) => {
                return product.brand_id === searching_brand;
            })

            let displayValue = results.map((result) => {
                let brand = brands.find((brand) => {
                    return brand.brand_id === result.brand_id;
                })
                let category = categories.find((cat) => {
                    return cat.cat_id === result.cat_id;
                })
                let descriptions = productsDescriptions.find((product) => {
                    return product.product_id === result.product_id;
                })
                
                return {
                    product_id: result.product_id,
                    product_name: result.product_name,
                    product_price: result.product_price,
                    product_salePrice: result.product_saleprice,
                    product_descriptions: descriptions.product_descriptions,
                    product_imageLink: `../../assets/images/products/summary/${result.product_id}-1.png`,
                    product_brand: brand.brand_name,
                    product_cat: category.cat_name
                }
            })
            return new Promise(resolve => {
                resolve(displayValue);
            })
        }
    })
    .then(displayValue => {
        // console.log(displayValue);
        let resultsDisplayBlock1 = document.querySelector('section .section__master .master--2 .master--2__result .show1');
        let resultsDisplayBlock2 = document.querySelector('section .section__master .master--2 .master--2__result .show2');

        // render display show1
        let displayValue1 = displayValue.map((value) => {
            return `
                <div>
                    <p class="brand">${value.product_cat} - ${value.product_brand}</p>
                    <a class="name" href="./product-detail.html?c=&b=&p=${value.product_id}" target="_blank">
                        ${value.product_name}
                    </a>
                    <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Picture">
                    <div class="price">
                        <p>$${value.product_salePrice}<br><span>$${value.product_price}</span></p>
                        <p><i class="fas fa-cart-plus"></i></p>
                    </div>
                    <div class="wishlist-compare">
                        <a href="" class="icon"><i class="far fa-heart"></i> Wishlist</a>
                        <a href="./compare.html?p=${value.product_id}" class="compare" target="_blank">
                            <i class="fas fa-retweet"></i> Compare
                        </a>
                    </div>
                </div>
            `
        })
        resultsDisplayBlock1.innerHTML = displayValue1.join('');

        // render diplay show2
        let displayValue2 = displayValue.map((value) => {
            return `
                <div>
                    <img src="../../assets/images/products/summary/${value.product_id}-1.png" alt="Product Picture">
                    <p class="brand">${value.product_cat} - ${value.product_brand}</p>
                    <a href="./product-detail.html?c=&b=&p=${value.product_id}" target="_blank">
                        ${value.product_name}
                    </a>
                    <p class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </p>
                    <p class="sku">SKU:<br>${value.product_id}</p>
                    <div class="price">
                        <p>$${value.product_salePrice}<br><span>$${value.product_price}</span></p>
                        <p><i class="fas fa-cart-plus"></i></p>
                    </div>
                </div>
            `
        })
        resultsDisplayBlock2.innerHTML = displayValue2.join('');
    })

// hide and show show1 - show2
let show1button = document.querySelector('section .section__master .master--2 .master--2__filter .displayType .fa-th');
let show2button = document.querySelector('section .section__master .master--2 .master--2__filter .displayType .fa-bars');
let show1DisplayBlock = document.querySelector('section .section__master .master--2 .master--2__result .show1');
let show2DisplayBlock = document.querySelector('section .section__master .master--2 .master--2__result .show2');

show1button.addEventListener('click', (e) => {
    show1button.style.color = 'var(--color-3)';
    show2button.style.color = 'rgba(51, 62, 72, 0.5)';

    show1DisplayBlock.classList.add('resultShow');
    show1DisplayBlock.classList.remove('resultHide');

    show2DisplayBlock.classList.add('resultHide');
    show2DisplayBlock.classList.remove('resultShow');
})

show2button.addEventListener('click', (e) => {
    show1button.style.color = 'rgba(51, 62, 72, 0.5)';
    show2button.style.color = 'var(--color-3)';

    show1DisplayBlock.classList.toggle('resultShow');
    show1DisplayBlock.classList.toggle('resultHide');

    show2DisplayBlock.classList.toggle('resultShow');
    show2DisplayBlock.classList.toggle('resultHide');
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

// render cart after loaded
Promise.all([productsSpecsApi])
    .then(([productsSpecs]) => {
        let productsInCartId = Object.keys(localStorage);
        // console.log(productsInCartId);
        
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