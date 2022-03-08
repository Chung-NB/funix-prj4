// javascript about us page

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

// verify signup email
let emailSignUpButton = document.querySelector('footer .footer__signupForm .submit input');

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

function myMap() {
    //   const platform = new H.service.Platform({ apikey: 'mTTICjBL1knfhCbCk9-fKyjceaxKho16uUPsegcFg60' });
    //   const defaultLayers = platform.createDefaultLayers();
    //   const map = new H.Map(document.getElementById('map'),
    //      defaultLayers.vector.normal.map, {
    //      center: { lat: 21.029906525781858, lng: 105.7815318079408 },
    //      zoom: 13,
    //      pixelRatio: window.devicePixelRatio || 1
    //   });
    //   window.addEventListener('resize', () => map.getViewPort().resize());
    //   const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    //   const ui = H.ui.UI.createDefault(map, defaultLayers);
    
    //   //Begin geocoding
    //   const searchText = 'Detech Building 2, No 8 Ton That Thuyet Street, My Dinh, Ha Noi';
    //   const geocoder = platform.getGeocodingService();
    //   geocoder.geocode({ searchText }, result => {
    //      const location = result.Response.View[0].Result[0].Location.DisplayPosition;
    //      const { Latitude : lat, Longitude: lng } = location;
    //      const marker = new H.map.Marker({ lat, lng });
    //      map.addObject(marker);
    //   });
    var num = new google.maps.LatLng(21.029906525781858,105.7815318079408); 
    var myOptions = { zoom: 16, center: num, mapTypeId: google.maps.MapTypeId.ROADMAP }; 
    var mymap = new google.maps.Map(document.getElementById("map"), myOptions); 
    var marker = new google.maps.Marker({ 
        position: num, 
        map: mymap, 
        title:"Detech Building 2, No8 Ton That Thuyet street, My Dinh Province, Ha Noi" });
    var mymap2 = new google.maps.Map(document.getElementById("map2"), myOptions); 
    var marker = new google.maps.Marker({ 
        position: num, 
        map: mymap2, 
        title:"Detech Building 2, No8 Ton That Thuyet street, My Dinh Province, Ha Noi" });
        
    }
