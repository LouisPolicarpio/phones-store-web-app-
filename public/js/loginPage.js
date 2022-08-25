$(document).ready(function () {

        $("div.signUpState").hide();
        $("div.loginState").show();
        $("div.resetState").hide();
    
   

    function getCookie(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let [key,value] = el.split('=');
          cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }

    //signUpState
    $(".submitRegister").click(function(){

        //TODO redirect user to previous page if they were trying to add to cart
        // also check fields are complete
        window.location.href="http://localhost:3000/"
        console.log("wrgwrg");
    })

    $(".haveAccountLogin").click(function(){
        $("div.signUpState").hide();
        $("div.loginState").show();
        $("div.resetState").hide();
    })

    //loginState
    $(".submitLogin").click(function(){
        //TODO redirect user to previous page if they were trying to add to cart
        // also check fields are complete
        window.location.href="http://localhost:3000/"
    })

    $(".noAccountRegister").click(function(){
        $("div.signUpState").show();
        $("div.loginState").hide();
        $("div.resetState").hide();
    })

    $('#signUpForm').submit(function() {
        
        var $inputs = $('#signUpForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });
        //var url = "http://localhost:3000/signup?"
        $.ajax({
            type: "POST", 
            url: "http://localhost:3000/signup?firstname="+values["firstName"]+"&lastname="+values["lastName"]+"&password="+values["password"]+"&email="+values["email"],
            success: function(data){
                window.location.href = "http://localhost:3000/"
            },
            error: function(data){
                alert("Failed to create account");
            }
        });
        return false;
    });

    $('#loginForm').submit(function() {
        var $inputs = $('#loginForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });
        //var url = "http://localhost:3000/signup?"
        // $.get("http://localhost:3000/login?email="+values["email"]+"&password="+values["password"], function(data){
        //     alert(data.status);
        //     window.location.href = "http://localhost:3000/"
        // });

        $.ajax({
            type: "GET", 
            url: "http://localhost:3000/login?email="+values["email"]+"&password="+values["password"],
            success: function(data){
                alert(data.status);
                window.location.href = "http://localhost:3000/";

            },
            error: function(data){
                alert("Login failed: Incorrect email or password");
                
            }
        });
        
        return false;
    });

    $('#resetForm').submit(function() {
        var $inputs = $('#resetForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });

        $.ajax({
            type: "POST", 
            url: "http://localhost:3000/reset-password?email="+values["email"],
            success: function(data){
                alert(data.status);
                window.location.href = "http://localhost:3000/";
            },
            error: function(data){
                alert("Email not found in database");
            }
        });
        return false;
    });

    $(".forgotPassword").click(function(){
        $("div.signUpState").hide();
        $("div.loginState").hide();
        $("div.resetState").show();
    })

    $('#resetPasswordForm').submit(function() {
        var $inputs = $('#resetPasswordForm :input');
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
           // console.log(this.val());
        });

        if(values["password1"] === values["password2"]){
            $.ajax({
                type: "PUT", 
                url: "http://localhost:3000/reset-new",
                data: JSON.stringify({
                    email: window.location.pathname.split("/").pop(),
                    password: values["password1"],
                }),
                contentType: "application/json",
                success: function(data){
                    alert("Password has been changed");
                    window.location.href = "http://localhost:3000/login-page";
                }
            });
        
            // console.log(JSON.stringify({
            //             email: window.location.pathname.split("/").pop(),
            //             password: values["password1"],
            // }));
                
        }
        else{
            // var queryDict = {};
            // location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
            // console.log(queryDict["email"]);
            alert("Passwords don't match");
        }

        // console.log(values["password1"]);
        // console.log(values[password2]);
        
        return false;
    });

    // function getEmailUrl() {
    //     let searchParams = new URLSearchParams(window.location.search)
    //     searchParams.has('email'); 
    //     let email = searchParams.get('email');
    //     console.log(email);
    //     return email;
        
    // };


});
