    // function itembtnClick(id){
    //     $.getJSON("http://localhost:3000/search?id=" + id, function (result){
    //         console.log("http://localhost:3000/search?id=" + id);
    //     });
    //     console.log(id);
    // }

$(document).ready(function () {

    $("div.homeState").show();
    $("div.searchState").hide();
    $("div.itemState").hide();


    if(getCookie("token")){
        $(".logInBtn").hide();
        $(".signInBtn").hide();
        $(".logOutBtn").show();
        $(".checkoutBtn").show();
        $(".profileBtn").show();
    }else{
        $(".logInBtn").hide();
        $(".signInBtn").show();
        $(".logOutBtn").hide();
        $(".checkoutBtn").hide();
        $(".profileBtn").hide();
    }

    $(".signInBtn").click(function(){
         
        window.location.href = "http://localhost:3000/login-page";
     });

     $(".logInBtn").click(function(){
         
        window.location.href = "http://localhost:3000/login-page";
     });

     $(".profileBtn").click(function(){
         
        window.location.href = "http://localhost:3000/user-page";
     });

     function removeProduct(productId){

        let storageProducts;
   

        if(storageProducts = JSON.parse(localStorage.getItem('products'))){
            let products = storageProducts.filter(product => product.id !== productId );
           localStorage.setItem('products', JSON.stringify(products));
        }

    }
   


    
    var data = '[{"id":10,"name":"sinu"},{"id":20,"name":"shinto"}]';

    var obj = JSON.parse(data);
    
    $.getJSON("http://localhost:3000/sold-out-soon", function (result) {
        $(".homeState").append('<h2>Sold Out Soon</h2>');
        $.each(result, function (i, field) {
            var id = "#sold"+i;
            $(".homeState").append('<div class = "card" id = "sold'+i+'" style="width: 18rem"></div>');               
                //console.log(field2 + " ");
                var bodyId = "#sold"+i+"bodyId";
                $(id).append('<img src = "'+field.image+'" class="card-img-top" alt = "img">');
                $(id).append('<div class = "card-body" id = "sold'+i+'bodyId"></div>');
                $(bodyId).append('<h5 class = "card-title"h5>$'+field.price+'</h5>');
                $(id).append('<button class="itembtn" id="'+field._id+'">Item Details</button>');
        });
    });

    $.getJSON("http://localhost:3000/best-sellers", function (result) {
        $(".homeState").append('<h2>Best Sellers</h2>');
        $.each(result, function (i, field) {
            var id = "#sellers"+i;
            $(".homeState").append('<div class = "card" id = "sellers'+i+'" style="width: 18rem"></div>');               
                //console.log(field2 + " ");
                var bodyId = "#sellers"+i+"bodyId";
                $(id).append('<img src = "'+field.image+'" class="card-img-top" alt = "img">');
                $(id).append('<div class = "card-body" id = "sellers'+i+'bodyId"></div>');
                $(bodyId).append('<h5 class = "card-title"h5>Average Rating: '+field.avg_rating.toFixed(1)+'</h5>');
                $(id).append('<button class="itembtn" id="'+field._id+'">Item Details</button>');
        });
    });

    $( "#searchBtn" ).click(function() {
        $("div.homeState").hide();
        $("div.searchState").show();
        $("div.itemState").hide();
        $(".searchState").empty();
        var searchField = $("#searchField"). val();
        var filter = $("#filter"). val();
        //TODO: get max value 
        var price = $("#sliderPrice"). val();
        $.getJSON("http://localhost:3000/search?searchTerm=" + searchField +"&filter=" + filter +"&price=" + price, function (result) {
            console.log(result);
            $.each(result, function (i, field) {
                var id = "#search"+i;
                $(".searchState").append('<div class = "card" id = "search'+i+'" style="width: 18rem"></div>');               
                    //console.log(field2 + " ");
                    var bodyId = "#search"+i+"bodyId";
                    $(id).append('<img src = "'+field.image+'" class="card-img-top" alt = "img">');
                    $(id).append('<div class = "card-body" id = "search'+i+'bodyId"></div>');
                    $(bodyId).append('<h5 class = "card-title"h5>'+field.title+'</h5>');
                    $(id).append('<button class="itembtn" id="'+field._id+'">Item Details</button>');
            });
        });
        
        
      });

      $(".checkoutBtn").click(function(){

        window.location.href = "http://localhost:3000/user-checkout"
      });

    var reviews = [];
      $(document).on('click', '.itembtn', function(){
        $("div.homeState").hide();
        $("div.searchState").hide();
        $("div.itemState").show();
        $(".itemImage").empty();
        $(".itemDetails").empty();
        $(".itemReviewBody").empty();
        var id = this.id;
        
        
       
        refresh(id);
        
        
        $.getJSON("http://localhost:3000/search?id=" + id, function (field){
            var availableStock = field.stock;
            let products = [];

            $(".addToCart").click(function(){
                if(getCookie("token")){
                    
                    console.log(availableStock);
                    while(true){
                        let quantity = prompt("Enter quantity:");
                        if(!quantity){
                            break;
                        }
                        else if(!quantity || isNaN(quantity) || quantity < 1){
                            alert("Invalid input, please try again:");
                        }else if(quantity > availableStock){
                            //add
                            alert("Quantity exceeds available stock, please try again:");
                        }else{
                            removeProduct(id);
                            if(localStorage.getItem('products')){
                                products = JSON.parse(localStorage.getItem('products'));
                                }
                    
                                products.push({'id' : id, "quantity" : quantity});
                    
                                localStorage.setItem('products', JSON.stringify(products));

                            $("#cartTotal").text('Cart Total: ' + getCartQuantity(id))
                            break;
                        }
                    }

    
                    } 
                    

                else{
                    window.location.href = "http://localhost:3000/login-page"

                }
                
            });


        });
               
        $('#addReviewForm').submit(function() {
            var $inputs = $('#addReviewForm :input');
            var values = {};
            $inputs.each(function() {
                values[this.name] = $(this).val();
               // console.log(this.val());
            });
        
            $.ajax({
                type: "POST", 
                url: "http://localhost:3000/add-review/",
                beforeSend: function(request) {
                    request.setRequestHeader("token", getCookie("token"));
                },
            
                data: JSON.stringify({
                    phoneId: id,
                    rating: values["rating"],
                    comment: values["reviewText"],
                }),
                contentType: "application/json",
                success: function(data){
                    alert(data.status);
                    refresh(id);
                },
                error: function(data){
                    alert("Must be signed in to add review");
                }
            });
    
    
            return false;
    
            
        
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

  $(".logOutBtn").click(function(){
    if (confirm("Confirm log out?") == true) {
        $.ajax({
            type: "POST", 
            url: "http://localhost:3000/logout",
            success: function(data){
                alert(data.status);
                $(".logInBtn").hide();
                $(".signInBtn").show();
                $(".logOutBtn").hide();
                $(".checkoutBtn").hide();
                $(".profileBtn").hide();
                localStorage.clear();
            }
        });
    }
  });

  

});

function readmore (id){
    var maxLength = 200;    
    var myStr = $(id).text();
    
    
    if ($.trim(myStr).length > maxLength) {
        var newStr = myStr.substring(0, maxLength);
        var removedStr = myStr.substring(maxLength, $.trim(myStr).length);

        $(id).empty().html(newStr);
        $(id).append('<a href="javascript:void(0);" class="read-more"> read more...</a>');
        $(id).append('<span class="more-text">'+removedStr+'</span>');
    }

    $(".read-more").click(function () {
        $(this).siblings(".more-text").contents().unwrap();
        $(this).remove();
    });
}

function getCartQuantity(productId){
    
    console.log(productId);
    let storageProducts;
   

    if(storageProducts = JSON.parse(localStorage.getItem('products'))){
        let products = storageProducts.filter(product => product.id === productId );
        console.log(products[0]);
        return products[0].quantity;
    }
    

   return 0;
}

function refresh(id){
    $(".itemImage").empty();
    $(".itemDetails").empty();
    $(".itemReviewBody").empty();

    $.getJSON("http://localhost:3000/search?id=" + id, function (field){
        console.log("http://localhost:3000/search?id=" + id);
        $(".itemImage").append('<img src = "'+field.image+'" class="card-img-top" alt = "img">');
        $(".itemDetails").append('<h5>'+field.title+'</h5>');
        $(".itemDetails").append('<p>Brand: '+field.brand+'</p>');
        $(".itemDetails").append('<p>Available Stock: '+field.stock+'</p>');
        
        $.getJSON("http://localhost:3000/seller-details?id=" + field.seller, function (field) {
            $(".itemDetails").append('<p>Seller: '+field.firstname+' '+field.lastname+'</p>');
        });
        
        $(".itemDetails").append('<p>Price: '+field.price+'</p>');
       // $(".itemReviews").append('<h5>Price: '+field.price+'</h5>');

        reviews = field.reviews;
        console.log(reviews);
        var max = 3;
        if(reviews.length < max){
            max = reviews.length;
        }
       for(let i = 0; i<max; i++){
           $(".itemReviewBody").append('<div class = "review" id = "reviewId'+i+'"></div>');

            $.getJSON("http://localhost:3000/seller-details?id=" + reviews[i].reviewer, function (field) {
                $("#reviewId"+i).append('<h5>Reviewer: '+field.firstname+' '+field.lastname+'</h5>');
                $("#reviewId"+i).append('<p>Rating: '+reviews[i].rating+'</p>');
                $("#reviewId" + i).append('<p class = "show-read-more" id ="test'+i+'">Comment: '+reviews[i].comment+'</p>');
                readmore("#test" + i);
            });
           
       }
       $(".moreReviewsBtn").click(function(){
        var len = $(".itemReviewBody").children().length;
        console.log(reviews);
        console.log(len);
        var max = len+3;
        if(reviews.length < max){
            max = reviews.length;
        }
        for(let i = len; i<max; i++){
            $(".itemReviewBody").append('<div class = "review" id = "reviewId'+i+'"></div>');

            $.getJSON("http://localhost:3000/seller-details?id=" + reviews[i].reviewer, function (field) {
                $("#reviewId"+i).append('<h5>Reviewer: '+field.firstname+' '+field.lastname+'</h5>');
                $("#reviewId"+i).append('<p>Rating: '+reviews[i].rating+'</p>');
                $("#reviewId" + i).append('<p class = "show-read-more" id ="test' + i + '">Comment: ' + reviews[i].comment + '</p>');
                readmore("#test" + i);
            });

        }
     });
     

     
});




}