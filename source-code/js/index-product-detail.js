// javascript product detail

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

// event onlick to show and hide all categories on side navbar
let showAllCategoryButton = document.querySelector('section .section__master .section--1__nav .all > li > p');
let allCategory = document.querySelector('section .section__master .section--1__nav .all > li > ul');
let allCategoryArrow = document.querySelector('section .section__master .section--1__nav .all .fa-chevron-down');

showAllCategoryButton.addEventListener('click', (e) => {
    allCategory.classList.toggle('hideAllCategory');
    allCategory.classList.toggle('blockAllCategory');
    
    allCategoryArrow.classList.toggle('fa-chevron-down');
    allCategoryArrow.classList.toggle('fa-chevron-up');
})

// call api
let categoriesApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/categories')
    .then(response => response.json());
let brandsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/brands')
    .then(response => response.json());
let productsSpecsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/product_specifications')
    .then(response => response.json());
let productsDescriptionsApi = fetch('https://622811389fd6174ca81a26c5.mockapi.io/product_descriptions')
    .then(response => response.json());

// render category list on side navbar
// render category, brand & product_name on breadcrumbs
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsDescriptionsApi])
    .then(([categories, brands, productsSpecs, productsDescriptions]) => {    
        // get query strings & render product name
        let product_id = getParameterByName('p');
        let allCategoryValue = productsSpecs.find((product) => {
            return product.product_id === product_id;
        })
        let productNameDisplayBlock = document.querySelector('section .section__breadcrumbs .product-breadcrumb');
        productNameDisplayBlock.innerText = allCategoryValue.product_name;

        // get & render brand name
        let brand = brands.find((brand) => {
            return brand.brand_id === allCategoryValue.brand_id;
        });
        let brandNameDisplayBlock = document.querySelector('section .section__breadcrumbs .brand-breadcrumb');
        brandNameDisplayBlock.innerText = brand.brand_name;

        // get & render cat name
        let category_id = allCategoryValue.cat_id;
        let category = categories.find(cat => {
            return cat.cat_id === category_id;
        })
        let catNameDisplayBlock = document.querySelector('section .section__breadcrumbs .category-breadcrumb');
        catNameDisplayBlock.innerText = category.cat_name;

        let caregoryNameBlock = document.querySelector('section .section__master .section__master--1 .categoryListTitle');
        caregoryNameBlock.innerText = category.cat_name;

        // get and render product image
        let productImageBlock = document.querySelector('section .section__master .section__master--2 .section--2__img');
        productImageBlock.style.backgroundImage = `url(../../assets/images/products/summary/${product_id}-1.png)`;
        
        // get & resolve category list
        let categoryListValue = category.cat_list;
        return new Promise(resolve => {
            resolve(categoryListValue);
        })

    })
    .then((categoryListValue) => {
        let displayCategoryKListBlock = document.querySelector('section .section__master .section__master--1 .categoryList')

        let categoryListDisplayValue = categoryListValue.map(value => {
            return `
                <li>
                    <a href="">${value}</a>
                </li>
            `
        })

        displayCategoryKListBlock.innerHTML = categoryListDisplayValue.join('');
    })

// render section 2 image & information
Promise.all([categoriesApi, brandsApi, productsSpecsApi, productsDescriptionsApi])
    .then(([categories, brands, productsSpecs, productsDescriptions]) => {
        // get query strings & render product name
        let product_id = getParameterByName('p');

        // get and render product image
        let productImageBlock = document.querySelector('section .section__master .section__master--2 .section--2__img');
        productImageBlock.style.backgroundImage = `url(../../assets/images/products/summary/${product_id}-1.png)`;
        
        // get & resolve information
        let product = productsSpecs.find(product => {
            return product.product_id === product_id;
        })
        let brand = brands.find((brand) => {
            return brand.brand_id === product.brand_id;
        })
        let category = categories.find((cat) => {
            return cat.cat_id === product.cat_id;
        })

        let descriptions = productsDescriptions.find(description => {
            return description.product_id === product.product_id;
        })

        return new Promise(resolve => {
            resolve([{
                category_name: category.cat_name,
                brand_name: brand.brand_name,
                product_id: product.product_id,
                product_name: product.product_name,
                product_price: product.product_price,
                product_salePrice: product.product_saleprice,
                product_quantity: product.product_quantity,
                product_description: descriptions.product_descriptions
            }]);
        })
    })
    .then(informationValue => {
        // render saleoff percentage
        let saleOffDislayBlock = document.querySelector('section .section__master .section__master--2 .section--2__saleoff');
        let product_price = Number(informationValue[0].product_price.replaceAll(",",""));
        let product_saleprice = Number(informationValue[0].product_salePrice.replaceAll(",",""));
        let discountPercent = ((product_price - product_saleprice)*100/product_price).toFixed(0);
        
        saleOffDislayBlock.innerText = `-${discountPercent}%`

        // render information title
        let informationTitleDisplayBlock = document.querySelector('section .section__master .information--title');
        let informationTitleDisplayValue = informationValue.map(value => {
            return `
                <div class="information--title">
                    <p class="information--brandName">${value.brand_name}</p>
                    <p class="information--productName">${value.product_name}</p>
                    <div class="information--productVote">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <p class="vote-text">(2 customers reviews)</p>
                    </div>
                    <p class="information--productQuantity">Availability: <span>${value.product_quantity} in stock</span></p>
                </div>
            `
        })
        informationTitleDisplayBlock.innerHTML = informationTitleDisplayValue.join('');

        // set href compare
        let compareDisplayBlock = document.querySelector('section .section__master .section__master--2 .information--compare');
        compareDisplayBlock.innerHTML = `   
            <a class="icon"><i class="far fa-heart"></i> Wishlist</a>
            <a href="./compare.html?p=${informationValue[0].product_id}" class="icon" target="_blank">
                <i class="fas fa-retweet"></i> Compare
            </a>
        `

        // render information descriptions
        let informationDescriptionsDisplayBlock = document.querySelector('section .section__master .information--descriptions');
        let informationDescriptionsDisplayValue = informationValue[0].product_description.map(value => {
            return `
                <li><p>${value}</p></li>
            `
        })
        informationDescriptionsDisplayBlock.innerHTML = informationDescriptionsDisplayValue.join('');

        // get download document href
        let informationDownloadDocumentBlock = document.querySelector('section .section__master .download');
        // console.log(informationDownloadDocumentBlock);
        informationDownloadDocumentBlock.innerHTML = `
            <a class="information--download" href="../../assets/product_specifications_documents/${informationValue[0].product_id}_specs.pdf" download>
                Product Specifications
            </a>
        `;

        // render price
        let priceDisplayBlock = document.querySelector('section .section__master .information--price');
        let priceDisplayValue = informationValue.map(value => {
            return `
            <p class="product__salePrice">$${value.product_salePrice}</p>
                <p class="product__price">$${value.product_price}</p>
            `
        })
        priceDisplayBlock.innerHTML = priceDisplayValue.join('');
    })

// count number of products add to card
let productNumberDisplayBlock = document.querySelector('section .section__master .section__master--2 .cart__number > input');
let productNumberCount = parseInt(productNumberDisplayBlock.value);
let productCartUp = document.querySelector('section .section__master .section__master--2 .cart__number .cart__button--up');
let productCartDown = document.querySelector('section .section__master .section__master--2 .cart__number .cart__button--down');

productCartUp.addEventListener('click', (e) => {
    productNumberCount += 1;
    productNumberDisplayBlock.value = productNumberCount;
})

productCartDown.addEventListener('click', (e) => {
    if(productNumberCount > 1) {
        productNumberCount -= 1;
        productNumberDisplayBlock.value = productNumberCount;
    }
    else {
        productNumberDisplayBlock.value = 1;
    }
})

// render specifications on master-2 content
Promise.all([productsSpecsApi, brandsApi])
    .then(([productsSpecs, brands]) => {    
        // get query strings & render product name
        let product_id = getParameterByName('p');
        let product = productsSpecs.find((product) => {
            return product.product_id === product_id;
        })

        let brand = brands.find(brand => {
            return brand.brand_id === product.brand_id;
        })
        
        let specsDisplayValueInit = [{
            product_name: product.product_name,
            product_brand: brand.brand_name,
            product_inventory: product.product_inventory,
            product_display: product.product_display,
            product_ram: product.product_ram,
            product_rom: product.product_rom,
            product_battery: product.product_battery
        }]
        return new Promise(resolve => {
            resolve(specsDisplayValueInit);
        })
    })
    .then(specsDisplayValueInit => {
        let specsDisplayBlock = document.querySelector('section .section__master .section__master--2 .master-2 .content .specs > ul');

        let specsDisplayValueFinal = specsDisplayValueInit.map(value => {
            return `
                <li><span>Product Name</span>${value.product_name}</li>
                <li><span>Brand Name</span>${value.product_brand}</li>
                <li><span>Product Inventory</span>${value.product_inventory}</li>
                <li><span>Display Resolution</span>${value.product_display}</li>
                <li><span>Product Ram</span>${value.product_ram}</li>
                <li><span>Product Rom</span>${value.product_rom}</li>
                <li><span>Product Battery</span>${value.product_battery}</li>
            `
        }) 

        specsDisplayBlock.innerHTML = specsDisplayValueFinal.join('');
    })

// hide and show specs / reviews
let specsButton = document.querySelector('section .section__master .section__master--2 .title > p:first-child');
let specsDisplayBLock = document.querySelector('section .section__master .section__master--2 .specs');
let commentsButton = document.querySelector('section .section__master .section__master--2  .title > p:last-child');
let commentsDisplayBlock = document.querySelector('section .section__master .section__master--2 .comments');

specsButton.addEventListener('click', (e) => {
    specsDisplayBLock.classList.add('specsShow');
    specsDisplayBLock.classList.remove('specsHide');
    specsButton.style.borderBottom = '3px solid var(--color-4)';

    commentsDisplayBlock.classList.add('commentsHide');
    commentsDisplayBlock.classList.remove('commentsShow');
    commentsButton.style.borderBottom = '3px solid rgba(0, 0, 0, 0)';
})

commentsButton.addEventListener('click', (e) => {
    specsDisplayBLock.classList.remove('specsShow');
    specsDisplayBLock.classList.add('specsHide');
    specsButton.style.borderBottom = '3px solid rgba(0, 0, 0, 0)';

    commentsDisplayBlock.classList.remove('commentsHide');
    commentsDisplayBlock.classList.add('commentsShow');
    commentsButton.style.borderBottom = '3px solid var(--color-4)';
})

// zoom product image when hover
$(function() {
    var zoom = function(elm) {
      elm
        .on('mouseover', function() {
          $(section).children('.section__master .section__master--2 .section--2__img').css({'transform': 'scale(2)'});
        })
        .on('mouseout', function() {
          $(section).children('.section__master .section__master--2 .section--2__img').css({'transform': 'scale(1)'});
        })
        .on('mousemove', function(e) {
          $(section).children('.section__master .section__master--2 .section--2__img').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
        })
    }
  
    $('.section .section__master .section__master--2 .section--2__img').each(function() {
      $(section)
        .append('<div class="img"></div>')
        .children('.section .section__master .section__master--2 .section--2__img').css({'background-image': 'url('+ $(this).data('image') +')'});
      zoom($(this));
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
        // totalPriceDisplayBlock.innerText = `$${totalPrice}.00`; 
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