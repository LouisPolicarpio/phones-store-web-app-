$(document).ready(function () {

    $("div.editProfileState").show();
    $("div.changePasswordState").hide();
    $("div.manageListingsState").hide();
    $("div.viewCommentsState").hide();

    $('#editProfileBtn').click(function(){
        $("div.changePasswordState").hide();
        $("div.manageListingsState").hide();
        $("div.viewCommentsState").hide();
        $("div.editProfileState").show();
    })

    $('#changePasswordBtn').click(function(){
        $("div.editProfileState").hide();
        $("div.manageListingsState").hide();
        $("div.viewCommentsState").hide();
        $("div.changePasswordState").show();
    })

    $('#manageListingsBtn').click(function(){
        $("div.editProfileState").hide();
        $("div.changePasswordState").hide();
        $("div.viewCommentsState").hide();
        $("div.manageListingsState").show();
        $(".newListing").hide();

    })

    $.ajax({
        type: "GET", 
        url: "http://localhost:3000/user",
        Headers: {
            "token": ("token", getCookie("token")),
        },
        
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            console.log("argwrg");
            $("#firstName").attr("value", data.firstname);
            $("#lastName").attr("value", data.lastname);
            $("#email").attr("value", data.email);

        }
    });

    $('#editProfileForm').submit(function() {
        var $inputs = $('#editProfileForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });
        //var url = "http://localhost:3000/signup?"
        let pwd = prompt("Enter current password to update details:");    
        if(prompt !== null){
            $.ajax({
                type: "PUT",
                beforeSend: function (request) {
                    request.setRequestHeader("token", getCookie("token"));
                },
                url: "http://localhost:3000/update-profile",
                data: JSON.stringify({
                    firstname: values["firstName"],
                    lastname: values["lastName"],
                    email: values["email"],
                    password: values[pwd],
                }),
                contentType: "application/json",
                success: function (data) {
                    alert("Profile details updated");

                }
            });
        }
        
        return false;
    });

    function getCookie(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let [key,value] = el.split('=');
          cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }

    $('#changePasswordForm').submit(function() {
        var $inputs = $('#changePasswordForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });

        $.ajax({
            type: "PUT", 
            url: "http://localhost:3000/update-password",
            beforeSend: function(request) {
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify({
                newPassword: values["newPassword"],
                oldPassword: values["oldPassword"],
            }),
            contentType: "application/json",
            success: function(data){
                alert("Password has been changed");
            }
        });

        
        return false;
    });

  
    loadListings();

    $('#newListingForm').submit(function() {
        var $inputs = $('#newListingForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });

        $.ajax({
            type: "POST", 
            beforeSend: function(request) {
                request.setRequestHeader("token", getCookie("token"));
            },
            url: "http://localhost:3000/add-listing/",
            data: JSON.stringify({
                title: values["title"],
                brand: values["brand"],
                image: "/phone_default_images/"+values["brand"]+".jpeg",
                stock: values["stock"],
                price: values["price"],
            }),
            contentType: "application/json",
            success: function(data){
                
                
                loadListings();
            }
        });

        return false;
    });

    $("#addListing").click(function(){
        $(".newListing").toggle();
    });

    $(document).on('click', '.enableBtn', function(e){
        $.ajax({
            type: "PUT", 
            url: "http://localhost:3000/enable-listing",
            beforeSend: function(request) {
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify({
                id: e.target.parentElement.id,

            }),
            contentType: "application/json",
            success: function(data){
                alert(data.status);
            }
        });

    });

    $(document).on('click', '.disableBtn', function(e){
        $.ajax({
            type: "PUT", 
            url: "http://localhost:3000/disable-listing",
            beforeSend: function(request) {
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify({
                id: e.target.parentElement.id,

            }),
            contentType: "application/json",
            success: function(data){
                alert(data.status);
            }
        });

    });

    $(document).on('click', '.removeBtn', function(e){
        $.ajax({
            type: "DELETE", 
            url: "http://localhost:3000/remove-listing",
            beforeSend: function(request) {
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify({
                id: e.target.parentElement.id,

            }),
            contentType: "application/json",
            success: function(data){
                alert(data.status);
                loadListings();
            }
        });
        

    });

    $('#viewCommentsBtn').click(function(){
        $(".viewCommentsState").empty();
        $("div.editProfileState").hide();
        $("div.manageListingsState").hide();
        $("div.changePasswordState").hide();
        $("div.viewCommentsState").show();
        

        $.ajax({
            type: "GET", 
            url: "http://localhost:3000/listings",
            Headers: {
                "token": ("token", getCookie("token")),
            },
            
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                if(data.status === "No phone entries for this user"){
                    $(".viewCommentsState").append('<h5>'+data.status+'</h5>');
                }
                else{
                 $.each(data, function (i, field) {
                var id = "#review"+i;
                $(".viewCommentsState").append('<div class = "card" id = "review'+i+'" style="width: 18rem"></div>');               
                    //console.log(field2 + " ");
                    var bodyId = "#review"+i+"bodyId";
                    $(id).append('<div class = "card-body" id = "review'+i+'bodyId"></div>');
                    $(bodyId).append('<h5 class = "card-title"h5>'+field.title+'</h5>');

                    $.each(field.reviews, function(i, review){
                        $(bodyId).append('<p>Comment: '+review.comment+'</p>');
                    
                    })
        
    
                 });
                }
            }
        });
    })

  

    function loadListings(){
        $(".listing").empty();

        $.ajax({
            type: "GET", 
            url: "http://localhost:3000/listings",
            Headers: {
                "token": ("token", getCookie("token")),
            },
            
            contentType: "application/json",
            dataType: "json",
            success: function(data){
                if(data.status === "No phone entries for this user"){
                    $(".listing").append('<h5>'+data.status+'</h5>');
                }
                else{
                 $.each(data, function (i, field) {
                var id = "#sold"+i;
                $(".listing").append('<div class = "card" id = "sold'+i+'" style="width: 18rem"></div>');               
                    //console.log(field2 + " ");
                    var bodyId = "#sold"+i+"bodyId";
                    $(id).append('<img src = "'+field.image+'" class="card-img-top" alt = "img">');
                    $(id).append('<div class = "card-body" id = "sold'+i+'bodyId"></div>');
                    $(bodyId).append('<h5 class = "card-title"h5>'+field.title+'</h5>');
                    $(id).append('<div class = "card-footer" id = "'+field._id+'"></div>');
                    $("#"+field._id).append('<button class="enableBtn" id="'+id+"Enable"+'">Enable</button>');
                    $("#"+field._id).append('<button class="disableBtn" id="'+id+"Disable"+'">Disable</button>');
                    $("#"+field._id).append('<button class="removeBtn" id="'+id+"Remove"+'">Remove</button>');
    
                 });
                }
            }
        });
    
    }
});