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

// render admin data
let usersApi = fetch('http://localhost:3000/user_details')
    .then(response => response.json())
    .then(users => {
        // get query string
        let admin_id = getParameterByName('uid');

        // get admin information
        let admin = users.find(user => {
            return user.user_id === admin_id;
        })
        console.log(admin);

        // assign admin information
        let adminAvatarDisplayBlock = document.querySelector('.nav-adminRole img');
        let adminNameDisplayBlock = document.querySelector('.nav-adminRole h4');
        let adminEmailDisplayBlock = document.querySelector('.nav-adminRole span');
        adminAvatarDisplayBlock.src = `../../assets/images/pics/admin_${admin.user_id}.png`;
        adminNameDisplayBlock.innerText = admin.user_name;
        adminEmailDisplayBlock.innerText = admin.user_email;
    })

// rest
var productApi = 'http://localhost:3000/product_specifications';

fetchProductData(renderProducts);

function fetchProductData(callback) {
    fetch('http://localhost:3000/product_specifications')
    .then(response => {
        return response.json();
    })
    .then(callback);
}

function createData(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(productApi, options)
        .then(function(response) {
            response.json();
        })
        .then(callback);
}

function deleteProduct(product_id) {
    var confirmDelete = confirm('Are you sure to delete this product?');
    if (confirmDelete ) {
        var options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
         };
        fetch(productApi + '/' + product_id, options)
            .then(function(response) { 
                response.json();
            })
            .then(function() {
                var productItem = document.querySelector('.product-id-'+ product_id);
                productItem.remove();
            });
        alert('Delete done!');
    }
    
}

function renderProducts(products) {
    var listProductAvailable = document.querySelector('#available_tbody');
    var htmls = products.map(function(product){
        return `
        <tr class="product-id-${product.product_id}">
            <td>${product.product_id}</td>
            <td style="height:"250px"><img width="100px" src="../../assets/images/products/summary/${product.product_id}-1.png"></td>
            <td>${product.product_name}</td>
            <td>${product.brand_id}</td>
            <td>${product.cat_id}</td>
            <td>${product.product_price}</td>
            <td>${product.product_inventory}</td>
            <td>
                <button type="button" id="editProductBtn" class="btn btn-warning" data-toggle="modal" onclick="EditRow(${product.id});" data-target="#editProduct"><i
                        class="fa fa-pen"></i></button>
                <button type="button" id="viewProductBtn" class="btn btn-primary" data-toggle="modal" data-target="#viewProduct"><i
                        class="fa fa-eye"></i></button>
                <button type="button" id="deleteProductBtn" class="btn btn-danger" data-toggle="modal" onclick="deleteProduct(${product.id});" data-target="#delete"><i
                        class="fa fa-trash"></i></button>
            </td>
        </tr>        
        `;
    });
    listProductAvailable.innerHTML = htmls.join('');
}

function handleForm() {
    var product_id = document.querySelector('input[name="product_id"]').value;
    var product_name = document.querySelector('input[name="product_name"]').value;
    var product_price = document.querySelector('input[name="product_price"]').value;
    var product_inventory = document.querySelector('input[name="product_inventory"]').value;
    var selectcat = document.getElementById("cat_id");
    var cat_id = selectcat.options[selectcat.selectedIndex].value;
    var selectbrand = document.getElementById("brand_id");
    var brand_id = selectbrand.options[selectbrand.selectedIndex].value;
    var productData = {
            product_id : product_id,
            product_name: product_name,
            product_price: product_price,
            product_inventory: product_inventory,
            cat_id: cat_id,
            brand_id: brand_id
        }; 
    createData(productData, function() {
        fetchProductData(renderProducts);
    });
    
}

function editProductInfo(id) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(productApi, options)
        .then(function(response) {
            response.json();
        })
        .then(function(data) {
            document.querySelector('input[name="product_id"]').value = product.product_id;
            document.querySelector('input[name="product_name"]').value = product.product_name;
            document.querySelector('input[name="product_price"]').value = product.product_price;
            document.querySelector('input[name="product_inventory"]').value = product.product_inventory;
            var selectcat = document.getElementById("cat_id");
            selectcat.options[selectcat.selectedIndex].value = product.cat_id;
            var selectbrand = document.getElementById("brand_id");
            selectbrand.options[selectbrand.selectedIndex].value = product.brand_id;
     
        });
}

function saveChanges() {
    var product_id = document.querySelector('input[name="product_id"]').value;
    var product_name = document.querySelector('input[name="product_name"]').value;
    var product_price = document.querySelector('input[name="product_price"]').value;
    var product_inventory = document.querySelector('input[name="product_inventory"]').value;
    var selectcat = document.getElementById("cat_id");
    var cat_id = selectcat.options[selectcat.selectedIndex].value;
    var selectbrand = document.getElementById("brand_id");
    var brand_id = selectbrand.options[selectbrand.selectedIndex].value;
    var productData = {
        product_id : product_id,
        product_name: product_name,
        product_price: product_price,
        product_inventory: product_inventory,
        cat_id: cat_id,
        brand_id: brand_id
    }; 
    var id_edit = document.querySelector('#form-edit-product').getAttribute('id_edit');
    var url_post = productApi + id_edit;

    fetch(url_post, {
        method: 'PATCH', 
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.id == id_edit) {
            alert('Edit done!');
            document.querySelector('input[name="product_id"]').value = '';
            document.querySelector('input[name="product_name"]').value = '';
            document.querySelector('input[name="product_price"]').value = '';
            document.querySelector('input[name="product_inventory"]').value = '';
            document.querySelector('#form-edit-product').removeAttribute('id_edit');
        }
    })
}