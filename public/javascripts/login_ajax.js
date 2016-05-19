
var Login = function() {

    var payload = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/authenticate',
        type: 'GET',
        contentType: "json",
        data: payload,
        complete: function(data) {
            if(data.responseJSON.authenticate){
                window.location.assign(data.responseJSON.originalUrl);
            }
            else{
                $('#message').html(data.responseJSON.message);


                $('#message').show();
            }



        }
    })
}

$(document).ready(function() {


    $('#Go').click(function(e) {
        console.log('Go! clicked');
        e.preventDefault();
        Login();
    });
});