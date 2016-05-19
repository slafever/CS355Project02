var information = function() {
    var payload = {
        title: $('title').val()
    };
    $.ajax({
        url: '/authentication',
        type: 'GET',
        contentType: 'json',
        data: payload,
        complete: function(data) {
            if (data.responseJSON.authenticate) {
                window.location.assign('/player/information');
            }
            else {
                $('#message').html(data.responseJSON.message);


                $('#message').show();
            }

        }
    })
}

$(document).ready(function(){
    $('#Go').click(function(e){
        console.log('Go clicked');
        e.preventDefault();
        information();
    });
});