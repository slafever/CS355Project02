var signup = function() {
    var payload = {
        FirstName: $('#FirstName').val(),
        LastName: $('#LastName').val(),
        Email: $('#Email').val(),
        Password: $('#Password').val()
    };

    $.ajax({
        url: 'users/insert_user',
        type: 'GET',
        contentType: "json",
        data: payload,
        complete : function(data){
            $('#message').html(data.responseJSON.message);
            $('#message').show();
            window.location.assign('/login');
        }
    })
}

$(document).ready(function(){
    $('#addBtn').click(function (g){
        console.log('addBtn Clicked');
        g.preventDefault();
        signup();
    })
})