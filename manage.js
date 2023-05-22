// var authToken = searchParams.get('token');
// acquire token from ^

$(function () {
   // Get all users
   $.ajax(
    {
        url: '/manage/users?token=' + sessionStorage.authToken,
        method: 'get',
    }
    ).done(
        function (data) {
            data.forEach(function(element) {
                $('#users').append(`
                    <div style="border:1px solid black ; width:300px">
                    <input type="submit" value="Delete User" onclick="return deleteUser('${element._id}')">
                        <h3>Name: ${element.name}</h3>
                        <h3>Username: ${element.username}</h3>
                    </div>
                `)
            });
        }
    ).fail(function (err) {
       console.log(err.responseText);
    }
    );

   // Get all feedbacks
    $.ajax(
    {
        url: '/manage/feedbacks?token=' + sessionStorage.authToken,
        method: 'get',
    }
    ).done(
        function (data) {
            data.forEach(function(element) {
                //console.log(element)
                $('#feedbacks').append(`
                

                    <div style="border:1px solid black ; width:300px">
                        <input type="submit" value="Delete Feedback" onclick="return deleteFeedback('${element._id}')">
                        <h3>Email: ${element.email}</h3>
                        <h3>Title: ${element.title}</h3>
                        <h3>Feedback: ${element.feedback}</h3>
                    </div>
                
                `)
            });
        }
    ).fail(
    function (err) {
       console.log(err.responseText);
    }
    );


})

function deleteUser(userId){
    console.log(userId)
    $.ajax({
        url:'/p/manage/users?token=' + sessionStorage.authToken,
        method:'delete',
        data:{
            userId : userId
        }
    }
    ).done(
        location.reload()
    ).fail()
}

function deleteFeedback(feedbackId){
    console.log(feedbackId)
    $.ajax({
        url:'/p/manage/feedbacks?token=' + sessionStorage.authToken,
        method:'delete',
        data:{
            feedbackId : feedbackId
    }}).done(
        location.reload()

    ).fail()
}

