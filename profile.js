
$(function () {
    authToken = sessionStorage.authToken
    console.log(authToken)
    $.ajax(
        {
<<<<<<< Updated upstream
            url: '/account/getUser/'+authToken+'?token='+authToken ,
=======
            url: '/p/getUser/'+authToken ,
>>>>>>> Stashed changes
            method: 'get',
        }
        ).done(
            function (data) {
                console.log(data.name)
                $(".yourInfo").append(`
                <img style="height: 300px;"
                src="images/users/${data._id}.png" alt=""><br>
                    Your Name: ${data.name} <br>
                    Your Username: ${data.username}<br>
                    Your password: ${data.password}<br>
                `)
                $("#newName").attr("value", `${data.name}`)
                $("#newUsername").attr("value", `${data.username}`)
                $("#newPassword").attr("value", `${data.password}`)
                $("#userIdForUpload").attr("value", `${data._id}`)
            }
        ).fail(function (err) {
           console.log(err.responseText);
        }
        );


    $('.editYourProfileBtn').click(
        function () {
            $(".editDiv").show();
        }
    )


    // GET USER DATA
    

})

function editProfile(){
    var uid = sessionStorage.userId
    var updatedUser = {
        newName:$("#newName").val(),
        newUsername: $("#newUsername").val(),
        newPassword:$("#newPassword").val(),
    }

    $.ajax(
        {
<<<<<<< Updated upstream
            url: '/account/profile/' + uid+'?token=' + authToken,
=======
            url: '/p/profile/' + uid,
>>>>>>> Stashed changes
            method: 'put',
            data: updatedUser
        }
        ).done(
            function (data) {
                alert("user updated!");
                window.location.href = "/";
            }
        ).fail(function (err) {
           console.log(err.responseText);
        }
        );
     console.log("edit form is submitted")
     return false
}




   