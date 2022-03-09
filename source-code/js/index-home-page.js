// javascript home

// header
// product count
let productCount = document.querySelectorAll('header .searchBlock__icons__productCount');
productCount[0].innerText = '0';
productCount[1].innerText = '0';

// header carousel
$(document).ready(function() {
    $('.header__carousel .owl-carousel').owlCarousel({
        loop:true,
        margin:5,
        responsive:{
            0:{
                items:2.5,
                nav:false
            },
            740:{
                items: 4.5,
                nav:false
            },
            1024:{
                items:8,
                nav:true
            }
        }
    })
});

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
        window.location.href = `./source-code/html/searching.html?c=&b=&k=${e.target.value}`;
    }
})

searchButton.addEventListener('click', (e) => {
    if(searchDisplayBlock.value !== '') {
        window.location.href = `./source-code/html/searching.html?c=&b=&k=${searchDisplayBlock.value}`;
    }
})

// call api
let categoriesApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/categories')
    .then(response => response.json());
let brandsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/brands')
    .then(response => response.json());
let productsSpecsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/product_specifications')
    .then(response => response.json());
let productsImagesApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/product_descriptions')
    .then(response => response.json());

// render products on deals of the day
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsImagesApi])
    .then(([categories, brands, productsSpecs, productsImages] )=> {
        let dealDayValueInit = productsSpecs.filter((product) => {
            return product.isDealOfTheDay === 'true';
        })

        let dealDayList = getDealDayProductsList(dealDayValueInit, categories, brands,
            productsSpecs, productsImages);

        return new Promise((resolve) => {
            resolve(dealDayList);
        })
    })
    .then((dealDayList) => {
        // console.log(dealDayList);
        let dealDayDisplayBlock = document.querySelector('section .section__dealOfTheDay .owl-carousel');

        let dealDayDisplayValue = dealDayList.map((value) => {
            return `
                <div class="item product__carousel">
                        <p class="cat">${value.category_name} - ${value.brand_name}</p>
                        <a href="./source-code/html/product-detail.html?c=&b=&p=${value.product_id}" 
                            target="_blank" class="name">
                                ${value.product_name}
                        </a>
                        <img src="${value.image_link}" alt="Product Image">
                        <div class="cart">
                            <div>
                                <p class="salePrice">$${value.product_saleprice}</p>
                                <p class="price">$${value.product_price}</p>
                                </div>
                            <div>
                            <i class="fas fa-cart-plus ${value.product_id}"></i></div>
                        </div>
                        <div class="wishlist-compare">
                            <p class="icon"><i class="far fa-heart"></i> Wishlist</p>
                            <a target="_blank" href="./source-code/html/compare.html?p=${value.product_id}" class="icon compare">
                                <i class="fas fa-retweet"></i> Compare
                            </a>
                        </div>
                </div>
            `
        })  
        dealDayDisplayBlock.innerHTML = dealDayDisplayValue.join('');
    })
    .catch(() => {
        let dealDayDisplayBlock = document.querySelector('section .section__dealOfTheDay .owl-carousel');
        dealDayDisplayBlock.innerHTML = `
                <div class="catch-block">
                    <p class="catch-spinner"><i class="fas fa-circle-notch fa-spin"></i></p>
                    <p class="catch-description">Loading data</p>
                </div>
            `;
    })    

function getDealDayProductsList(dealDayValueInit, categories, brands, productsSpecs, productsImages) {
    let dealDayValue = dealDayValueInit.map((product) => {
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })
        let image = productsImages.find((image) => {
            return image.product_id === product.product_id;
        })
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_saleprice: product.product_saleprice,
            brand_name: brand.brand_name,
            category_name: category.cat_name,
            image_link: `./assets/images/products/summary/${product.product_id}-1.png`
        }
    })
    return new Promise((resolve) => {
        resolve(dealDayValue);
    })
}

// section deal of the day carousel
setTimeout(() => {
    $(document).ready(function() {
        $('.section__dealOfTheDay--block .owl-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            lazyload: true,
            responsive:{
                0:{
                    items:1.7,
                    nav:false,
                    dots: true
                },
                740:{
                    items: 3.5,
                    nav:false
                },
                1025:{
                    items:6.5,
                    nav:false,
                    dots: true
                }
            }
        })
    });
}, 2000)

// render products on laptop & pc
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsImagesApi])
    .then(([categories, brands, productsSpecs, productsImages] )=> {
        let laptoppcValueInit = productsSpecs.filter((product) => {
            return product.cat_id === 'laptoppc';
        })

        let laptoppcList = getLaptoppcProductsList(laptoppcValueInit, categories, brands,
            productsSpecs, productsImages);

        return new Promise((resolve) => {
            resolve(laptoppcList);
        })
    })
    .then((laptoppcList) => {
        // console.log(laptoppcList);
        let laptoppcDisplayBlock = document.querySelector('section .section__laptoppc--block .owl-carousel');
        
        let laptoppcDisplayValue = laptoppcList.map((value) => {
            return `
                <div class="item product__carousel">
                    <p class="cat">${value.category_name} - ${value.brand_name}</p>
                    <a href="./source-code/html/product-detail.html?c=&b=&p=${value.product_id}" 
                        target="_blank" class="name">
                            ${value.product_name}
                    </a>
                    <img src="${value.image_link}" alt="Product Image">
                    <div class="cart">
                        <div>
                            <p class="salePrice">$${value.product_saleprice}</p>
                            <p class="price">$${value.product_price}</p>
                            </div>
                        <div>
                        <i class="fas fa-cart-plus ${value.product_id}"></i></div>
                    </div>
                    <div class="wishlist-compare">
                        <p class="icon"><i class="far fa-heart"></i> Wishlist</p>
                        <a target="_blank" href="./source-code/html/compare.html?p=${value.product_id}" class="icon compare">
                            <i class="fas fa-retweet"></i> Compare
                        </a>
                    </div>
                </div>
            `
        })
        let laptoppcDisplayValueFinal = [];
        for(let i = 0; i < 14; i++) {
            laptoppcDisplayValueFinal.push(laptoppcDisplayValue[i]);
        }
        laptoppcDisplayBlock.innerHTML = laptoppcDisplayValueFinal.join('');
    })
    .catch(() => {
        let laptoppcDisplayBlock = document.querySelector('section .section__laptoppc--block .owl-carousel');
        laptoppcDisplayBlock.innerHTML = `
                <div class="catch-block">
                    <p class="catch-spinner"><i class="fas fa-circle-notch fa-spin"></i></p>
                    <p class="catch-description">Loading data</p>
                </div>
            `;
    }) 

function getLaptoppcProductsList(laptoppcValueInit, categories, brands, productsSpecs, productsImages) {
    let laptoppcValueFinal = laptoppcValueInit.map((product) => {
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let image = productsImages.find((image) => {
            return image.product_id === product.product_id;
        })
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_saleprice: product.product_saleprice,
            brand_name: brand.brand_name,
            category_name: category.cat_name,
            image_link: `./assets/images/products/summary/${product.product_id}-1.png`
        }
    })
    return new Promise((resolve) => {
        resolve(laptoppcValueFinal);
    })
}

// laptop & pc carousel
setTimeout(() => {
    $(document).ready(function() {
        $('.section__laptoppc--block .owl-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            lazyload: true,
            responsive:{
                0:{
                    items:1.8,
                    nav:false,
                    dots: true
                },
                740:{
                    items: 3.5,
                    nav:false
                },
                1025:{
                    items:6.5,
                    nav:false,
                    dots: true
                }
            }
        })
    });
}, 2000)

// render products on mobiles & tablets
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsImagesApi])
    .then(([categories, brands, productsSpecs, productsImages] )=> {
        let mobilestabletsValueInit = productsSpecs.filter((product) => {
            return product.cat_id === 'mobilestablets';
        })

        let mobilestabletsList = getMobilestabletsProductsList(mobilestabletsValueInit, categories, brands,
            productsSpecs, productsImages);

        return new Promise((resolve) => {
            resolve(mobilestabletsList);
        })
    })
    .then((mobilestabletsList) => {
        let mobilestabletsDisplayBlock = document.querySelector('section .section__mobilestablets--block .owl-carousel');
        
        let mobilestabletsDisplayValue = mobilestabletsList.map((value) => {
            return `
                <div class="item product__carousel">
                    <p class="cat">${value.category_name} - ${value.brand_name}</p>
                    <a href="./source-code/html/product-detail.html?c=&b=&p=${value.product_id}" 
                        target="_blank" class="name">
                            ${value.product_name}
                    </a>
                    <img src="${value.image_link}" alt="Product Image">
                    <div class="cart">
                        <div>
                            <p class="salePrice">$${value.product_saleprice}</p>
                            <p class="price">$${value.product_price}</p>
                            </div>
                        <div>
                        <i class="fas fa-cart-plus ${value.product_id}"></i></div>
                    </div>
                    <div class="wishlist-compare">
                        <p class="icon"><i class="far fa-heart"></i> Wishlist</p>
                        <a target="_blank" href="./source-code/html/compare.html?p=${value.product_id}" class="icon compare">
                            <i class="fas fa-retweet"></i> Compare
                        </a>
                    </div>
                </div>
            `
        })
        let mobilestabletsDisplayValueFinal = [];
        for(let i = 0; i < 14; i++) {
            mobilestabletsDisplayValueFinal.push(mobilestabletsDisplayValue[i]);
        }
        mobilestabletsDisplayBlock.innerHTML = mobilestabletsDisplayValueFinal.join('');
    })
    .catch(() => {
        let mobilestabletsDisplayBlock = document.querySelector('section .section__mobilestablets--block .owl-carousel');
        mobilestabletsDisplayBlock.innerHTML = `
                <div class="catch-block">
                    <p class="catch-spinner"><i class="fas fa-circle-notch fa-spin"></i></p>
                    <p class="catch-description">Loading data</p>
                </div>
            `;
    }) 

function getMobilestabletsProductsList(mobilestabletsValueInit, categories, brands, productsSpecs, productsImages) {
    let mobilestabletsValueFinal = mobilestabletsValueInit.map((product) => {
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let image = productsImages.find((image) => {
            return image.product_id === product.product_id;
        })
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_saleprice: product.product_saleprice,
            brand_name: brand.brand_name,
            category_name: category.cat_name,
            image_link: `./assets/images/products/summary/${product.product_id}-1.png`
        }
    })
    return new Promise((resolve) => {
        resolve(mobilestabletsValueFinal);
    })
}

// mobiles & tablets carousel
setTimeout(() => {
    $(document).ready(function() {
        $('.section__mobilestablets--block .owl-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            lazyload: true,
            responsive:{
                0:{
                    items:1.8,
                    nav:false,
                    dots: true
                },
                740:{
                    items: 3.5,
                    nav:false
                },
                1025:{
                    items:6.5,
                    nav:false,
                    dots: true
                }
            }
        })
    });
}, 2000)

// render products on display & audio
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsImagesApi])
    .then(([categories, brands, productsSpecs, productsImages] )=> {
        let displayaudioValueInit = productsSpecs.filter((product) => {
            return product.cat_id === 'displayaudio';
        })

        let displayaudioList = getDisplayaudioProductsList(displayaudioValueInit, categories, brands,
            productsSpecs, productsImages);

        return new Promise((resolve) => {
            resolve(displayaudioList);
        })
    })
    .then((displayaudioList) => {
        let displayaudioDisplayBlock = document.querySelector('section .section__displayaudio--block .owl-carousel');
        
        let displayaudioDisplayValue = displayaudioList.map((value) => {
            return `
                <div class="item product__carousel">
                    <p class="cat">${value.category_name} - ${value.brand_name}</p>
                    <a href="./source-code/html/product-detail.html?c=&b=&p=${value.product_id}" 
                        target="_blank" class="name">
                            ${value.product_name}
                    </a>
                    <img src="${value.image_link}" alt="Product Image">
                    <div class="cart">
                        <div>
                            <p class="salePrice">$${value.product_saleprice}</p>
                            <p class="price">$${value.product_price}</p>
                            </div>
                        <div>
                        <i class="fas fa-cart-plus ${value.product_id}"></i></div>
                    </div>
                    <div class="wishlist-compare">
                        <p class="icon"><i class="far fa-heart"></i> Wishlist</p>
                        <a target="_blank" href="./source-code/html/compare.html?p=${value.product_id}" class="icon compare">
                            <i class="fas fa-retweet"></i> Compare
                        </a>
                    </div>
                </div>
            `
        })
        let displayaudioDisplayValueFinal = [];
        for(let i = 0; i < 14; i++) {
            displayaudioDisplayValueFinal.push(displayaudioDisplayValue[i]);
        }
        displayaudioDisplayBlock.innerHTML = displayaudioDisplayValueFinal.join('');
    })
    .catch(() => {
        let displayaudioDisplayBlock = document.querySelector('section .section__displayaudio--block .owl-carousel');
        displayaudioDisplayBlock.innerHTML = `
                <div class="catch-block">
                    <p class="catch-spinner"><i class="fas fa-circle-notch fa-spin"></i></p>
                    <p class="catch-description">Loading data</p>
                </div>
            `;
    }) 

function getDisplayaudioProductsList(displayaudioValueInit, categories, brands, productsSpecs, productsImages) {
    let displayaudioValueFinal = displayaudioValueInit.map((product) => {
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let image = productsImages.find((image) => {
            return image.product_id === product.product_id;
        })
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_saleprice: product.product_saleprice,
            brand_name: brand.brand_name,
            category_name: category.cat_name,
            image_link: `./assets/images/products/summary/${product.product_id}-1.png`
        }
    })
    return new Promise((resolve) => {
        resolve(displayaudioValueFinal);
    })
}

// display & audio carousel
setTimeout(() => {
    $(document).ready(function() {
        $('.section__displayaudio--block .owl-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            lazyload: true,
            responsive:{
                0:{
                    items:1.8,
                    nav:false,
                    dots: true
                },
                740:{
                    items: 3.5,
                    nav:false
                },
                1025:{
                    items:6.5,
                    nav:false,
                    dots: true
                }
            }
        })
    });
}, 2000)

// render products on accessories
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsImagesApi])
    .then(([categories, brands, productsSpecs, productsImages] )=> {
        let accessoriesValueInit = productsSpecs.filter((product) => {
            return product.cat_id === 'accessories';
        })

        let accessoriesList = getAccessoriesProductsList(accessoriesValueInit, categories, brands,
            productsSpecs, productsImages);

        return new Promise((resolve) => {
            resolve(accessoriesList);
        })
    })
    .then((accessoriesList) => {
        let accessoriesDisplayBlock = document.querySelector('section .section__accessories--block .owl-carousel');
        
        let accessoriesDisplayValue = accessoriesList.map((value) => {
            return `
                <div class="item product__carousel">
                    <p class="cat">${value.category_name} - ${value.brand_name}</p>
                    <a href="./source-code/html/product-detail.html?c=&b=&p=${value.product_id}" 
                        target="_blank" class="name">
                            ${value.product_name}
                    </a>
                    <img src="${value.image_link}" alt="Product Image">
                    <div class="cart">
                        <div>
                            <p class="salePrice">$${value.product_saleprice}</p>
                            <p class="price">$${value.product_price}</p>
                            </div>
                        <div>
                        <i class="fas fa-cart-plus ${value.product_id}"></i></div>
                    </div>
                    <div class="wishlist-compare">
                        <p class="icon"><i class="far fa-heart"></i> Wishlist</p>
                        <a target="_blank" href="./source-code/html/compare.html?p=${value.product_id}" class="icon compare">
                            <i class="fas fa-retweet"></i> Compare
                        </a>
                    </div>
                </div>
            `
        })
        let accessoriesDisplayValueFinal = [];
        for(let i = 0; i < 14; i++) {
            accessoriesDisplayValueFinal.push(accessoriesDisplayValue[i]);
        }
        accessoriesDisplayBlock.innerHTML = accessoriesDisplayValueFinal.join('');
    })
    .catch(() => {
        let accessoriesDisplayBlock = document.querySelector('section .section__accessories--block .owl-carousel');
        accessoriesDisplayBlock.innerHTML = `
                <div class="catch-block">
                    <p class="catch-spinner"><i class="fas fa-circle-notch fa-spin"></i></p>
                    <p class="catch-description">Loading data</p>
                </div>
            `;
    }) 

function getAccessoriesProductsList(accessoriesValueInit, categories, brands, productsSpecs, productsImages) {
    let accessoriesValueFinal = accessoriesValueInit.map((product) => {
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let image = productsImages.find((image) => {
            return image.product_id === product.product_id;
        })
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_saleprice: product.product_saleprice,
            brand_name: brand.brand_name,
            category_name: category.cat_name,
            image_link: `./assets/images/products/summary/${product.product_id}-1.png`
        }
    })
    return new Promise((resolve) => {
        resolve(accessoriesValueFinal);
    })
}

// accessories carousel
setTimeout(() => {
    $(document).ready(function() {
        $('.section__accessories--block .owl-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            lazyload: true,
            responsive:{
                0:{
                    items:1.8,
                    nav:false,
                    dots: true
                },
                740:{
                    items: 3.5,
                    nav:false
                },
                1025:{
                    items:6.5,
                    nav:false,
                    dots: true
                }
            }
        })
    });
}, 2000)

// render products on others
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsImagesApi])
    .then(([categories, brands, productsSpecs, productsImages] )=> {
        let othersValueInit = productsSpecs.filter((product) => {
            return product.cat_id === 'others';
        })

        let othersList = getOthersProductsList(othersValueInit, categories, brands,
            productsSpecs, productsImages);

        return new Promise((resolve) => {
            resolve(othersList);
        })
    })
    .then((othersList) => {
        // console.log(othersList);
        let othersDisplayBlock = document.querySelector('section .section__others--block .owl-carousel');
        
        let othersDisplayValue = othersList.map((value) => {
            return `
                <div class="item product__carousel">
                    <p class="cat">${value.category_name} - ${value.brand_name}</p>
                    <a href="./source-code/html/product-detail.html?c=&b=&p=${value.product_id}" 
                        target="_blank" class="name">
                            ${value.product_name}
                    </a>
                    <img src="${value.image_link}" alt="Product Image">
                    <div class="cart">
                        <div>
                            <p class="salePrice">$${value.product_saleprice}</p>
                            <p class="price">$${value.product_price}</p>
                            </div>
                        <div>
                        <i class="fas fa-cart-plus ${value.product_id}"></i></div>
                    </div>
                    <div class="wishlist-compare">
                        <p class="icon"><i class="far fa-heart"></i> Wishlist</p>
                        <a target="_blank" href="./source-code/html/compare.html?p=${value.product_id}" class="icon compare">
                            <i class="fas fa-retweet"></i> Compare
                        </a>
                    </div>
                </div>
            `
        })
        othersDisplayBlock.innerHTML = othersDisplayValue.join('');
    })
    .catch(() => {
        let othersDisplayBlock = document.querySelector('section .section__accessories--block .owl-carousel');
        othersDisplayBlock.innerHTML = `
                <div class="catch-block">
                    <p class="catch-spinner"><i class="fas fa-circle-notch fa-spin"></i></p>
                    <p class="catch-description">Loading data</p>
                </div>
            `;
    }) 

function getOthersProductsList(othersValueInit, categories, brands, productsSpecs, productsImages) {
    let othersValueFinal = othersValueInit.map((product) => {
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let image = productsImages.find((image) => {
            return image.product_id === product.product_id;
        })
        return {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_saleprice: product.product_saleprice,
            brand_name: brand.brand_name,
            category_name: category.cat_name,
            image_link: `./assets/images/products/summary/${product.product_id}-1.png`
        }
    })
    return new Promise((resolve) => {
        resolve(othersValueFinal);
    })
}

// other products carousel
setTimeout(() => {
    $(document).ready(function() {
        $('.section__others--block .owl-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            lazyload: true,
            responsive:{
                0:{
                    items:1.8,
                    nav:false,
                    dots: true
                },
                1025:{
                    items:6.5,
                    nav:false,
                    dots: true
                }
            }
        })
    });
}, 2000)

// verify signup email
let emailSignUpButton = document.querySelector('section .section__signupForm .submit button');

emailSignUpButton.addEventListener('click', e => {
    let emailSignUpBlock = document.querySelector('section .section__signupForm .submit input');
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

// cart
// localStorage.clear();
let quickCartDisplayBlock = document.querySelector('header .searchBlock .searchBlock__icons__productShow');
let quickCartDisplayButton = document.querySelector('header .searchBlock__icons');
quickCartDisplayButton.addEventListener('click', e => {
    quickCartDisplayBlock.classList.toggle('productShow');
    quickCartDisplayBlock.classList.toggle('productHide');
})

setTimeout(() => {
    let cartProductsButtons = document.querySelectorAll('section .product__carousel .cart .fas');
    for(let i in cartProductsButtons) {
        cartProductsButtons[i].onclick = e => {
            let productId = e.target.classList[2];
            localStorage.setItem(`${productId}`,1);
            
            let cartProducts = Object.keys(localStorage);
            let cartProductsValue = [... new Set(cartProducts)];
            
            Promise.all([categoriesApi, brandsApi, productsSpecsApi])
                .then(([categories, brands, productsSpecs] )=> {
                    let productList = [];
                    for(let i of cartProductsValue) {
                        let product = productsSpecs.find(product => {
                            return product.product_id === i;
                        })
                        productList.push(product);
                    }
                    // console.log(productList);

                    let cartProducsDisplayValue = productList.map(product => {
                        let brand = brands.find(brand => {
                            return brand.brand_id === product.brand_id;
                        })
                        let category = categories.find(cat => {
                            return cat.cat_id === product.cat_id;
                        })
                        return {
                            product_id: product.product_id,
                            product_name: product.product_name,
                            product_saleprice: product.product_saleprice
                        }
                    })

                    return new Promise(resolve => {
                        resolve(cartProducsDisplayValue);
                    })
                })
                .then(cartProducsDisplayValue => {
                    let cartProductsDisplayBlock = document.querySelector('header .searchBlock .searchBlock__icons__productShow .product--list');

                    let cartProducsDisplayValueFinal = cartProducsDisplayValue.map(product => {
                        return `
                            <div>
                                <p class="name">${product.product_name}</p>
                                <img src="../../assets/images/products/summary/${product.product_id}-1.png" alt="Product Image">
                                <p class="number">x1</p>
                                <p class="delete"><i class="fas fa-trash-alt ${product.product_id} ${product.product_saleprice}"></i></p>
                            </div>
                        `
                    })

                    // product count
                    // phải set cả đếm bên ngoài vì nếu không thì nó sẽ chỉ biến đổi khi click vào xóa
                    let productCountDisplayBlock = document.querySelectorAll('header .searchBlock__icons__productCount');
                    let productCountValue = localStorage.length;
                    // console.log(productCountValue);

                    if(productCountValue > 0) {
                        productCountDisplayBlock[0].innerText = productCountValue;
                        productCountDisplayBlock[1].innerText = productCountValue;
                    }
                    else {
                        productCountDisplayBlock[0].innerText = '0';
                        productCountDisplayBlock[1].innerText = '0';
                    }

                    // render total price
                    let totalPriceDisplayBlock = document.querySelector('header .searchBlock .searchBlock__icons .totalPrice');
                    let totalPrice = cartProducsDisplayValue.reduce((initPrice, currenProduct) => {
                        return initPrice + Number(currenProduct.product_saleprice.replaceAll(",",""));
                    }, 0)
                    totalPriceDisplayBlock.innerText = `$${totalPrice}.00`;
                    // console.log(totalPrice);
            
                    // render products on quick-cart
                    if(productCountValue !== 0) {
                        cartProductsDisplayBlock.innerHTML = cartProducsDisplayValueFinal.join('');
                    }
                    else {
                        cartProductsDisplayBlock.innerHTML = `
                            <p class="noProduct">No Product <i class="fas fa-heart-broken"></i></p>
                        `
                    }

                    let deleteIcons = document.querySelectorAll('header .searchBlock .searchBlock__icons__productShow .product--list .fa-trash-alt');
                    let productsList = document.querySelectorAll('header .searchBlock .searchBlock__icons__productShow .product--list > div');
                    for(let i in deleteIcons) {
                        deleteIcons[i].onclick = e => {
                            let deleteProductId = e.target.classList[2];
                            localStorage.removeItem(deleteProductId);
                            productsList[i].remove();

                            console.log(deleteIcons[i]);
                            // render product count
                            let productCountValue = localStorage.length;
                            console.log(productCountValue);
                            if(productCountValue > 0) {
                                productCountDisplayBlock[0].innerText = productCountValue;
                                productCountDisplayBlock[1].innerText = productCountValue;
                            }
                            else {
                                productCountDisplayBlock[0].innerText = '0';
                                productCountDisplayBlock[1].innerText = '0';
                            }
                            // render no porduct emotional damage
                            if(productCountValue === 0) {
                                cartProductsDisplayBlock.innerHTML = `
                                    <p class="noProduct">No Product <i class="fas fa-heart-broken"></i></p>
                                `
                            }
                            // render total price
                            let deleteProductPrice = Number(e.target.classList[3].replaceAll(",",""));
                            totalPrice = totalPrice - deleteProductPrice;
                            if(productCountValue === 0) {
                                totalPriceDisplayBlock.innerText = '$0.00';
                            }
                            else {
                                totalPriceDisplayBlock.innerText = `$${totalPrice}.00`;
                            }
                        }
                    }
                })
        }
    }
}, 2000)

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