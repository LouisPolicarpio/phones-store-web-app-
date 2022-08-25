$(document).ready(function () {
    console.log(JSON.parse(localStorage.products));
    $(".confirmBtn").click(function(){
        $.ajax({
            type: "PUT", 
            url: "http://localhost:3000/checkout",
            beforeSend: function(request) {
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify({
                listings: JSON.parse(localStorage.products),

            }),
            contentType: "application/json",
            success: function(data){
                alert(data.status);
                $(".checkoutList").empty();
                $(".total").empty();
                localStorage.clear();
                window.location.href = "http://localhost:3000/"
            },
            //TODO
            error: function(data){
                alert("Checkout failed");
            }
        });

    });

    function getCookie(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let [key,value] = el.split('=');
          cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }
        
        
    // JSON.parse(localStorage.getItem(""))

    // var something = localstorage.products[0];
    // var length = something.length;
    // alert("length = " + length);

    // console.log(JSON.parse(localStorage.products).length);

    refresh();

    $(document).on('click', '.updateQuantity', function(e){     
        removeProduct(e.target.parentElement.id); 


        // console.log(e.target.parentElement.children[3].value);

        let quantity = e.target.parentElement.children[3].value;

        if(quantity > 0){

            if(localStorage.getItem('products')){
            products = JSON.parse(localStorage.getItem('products'));
            }
    
            products.push({'id' : e.target.parentElement.id, "quantity" : quantity});
    
            localStorage.setItem('products', JSON.stringify(products));
    
        }
        refresh();
        
                    
    });

    $(document).on('click', '.removeItem', function(e){     
        removeProduct(e.target.parentElement.id);      

        refresh();
        
                    
    });

});

function refresh(){
    $(".checkoutList").empty();
    $(".total").empty();

    let productsJSON = JSON.parse(localStorage.products);

    var total = 0;


    for(let i = 0; i < productsJSON.length; i++){
        
        total = parseFloat(total) + parseFloat(getPhone(productsJSON[i].id, productsJSON[i].quantity, i));
       
        
    }
    // console.log($(".checkoutList").children[0]);
    // console.log(total);
    $(".total").append('<p>Total: "'+total+'"</p>')
}

function removeProduct(productId){

    let storageProducts = JSON.parse(localStorage.getItem('products'));
    let products = storageProducts.filter(product => product.id !== productId );
    localStorage.setItem('products', JSON.stringify(products));
}
    


function getPhone(id, quantity, i){
    var sum = 0;
    var price = 0;

    $.ajax({
        async: false,
        type: "GET", 
        url: "http://localhost:3000/search?id=" + id,
        
        contentType: "application/json",
        dataType: "json",
        success: function(field){             
                //console.log(field2 + " ");
                var classId = "#"+id;
                $(".checkoutList").append('<div id = "'+id+'"></div>')
                $(classId).append('<h5>'+field.title+'</h5>');
                $(classId).append('<p>Price: $'+field.price+'</p>');
                $(classId).append('<label for = "'+i+'">Quantity:</label>');
                $(classId).append('<input type = "number" value = "'+quantity+'" id = "'+i+'" min = "0" max = "'+field.stock+'" class = "newQuantity"></input>');
                $(classId).append('<button class = "updateQuantity">Update Quantity</button>');
                $(classId).append('<button class = "removeItem">Remove Item</button>');

                price = field.price;
            

            }
        
    });
    sum = quantity * price;
    return sum;

}

function sumTotal(price, quantity){
    var sum = 0;
    var price = 0;
    var quantity = 0;

    sum = price * quantity;

    return sum;
}




