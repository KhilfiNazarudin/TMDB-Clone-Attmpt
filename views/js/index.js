var searchParams = new URLSearchParams(window.location.search)
var keyword = searchParams.get('keyword');
var baseURL = 'https://api.themoviedb.org/3/'
var api_key = '?api_key=d531746f62591cbf027fc279fd5d3c44'
var listOfPoints = [];
var points;
var colour = "255,255,178";
var urlParams = '';
$(function () {
    if (keyword == null || keyword == '') {
        $.ajax({
            url: baseURL + 'movie/popular' + api_key,
            method: "get"
        }).done(
            function (data) {
                data.results.forEach(function (movies) {

                    $("#moviesContainer").append(`
                        <a href="/movieDetails?id=${movies.id}">             
                            <article>
                                <h2>${movies.title}</h2>
                                <p>
                                <img style="height: 500px"
                                class="logo" src="https://image.tmdb.org/t/p/original/${movies.poster_path}" alt="NO IMAGE??">
                                </p>
                            </article>
                        </a>
                        `);
                }

                );
            }
        ).fail()
    } else {
        $.ajax({
            url: baseURL + 'search/movie' + api_key + '&query=' + keyword,
            method: "get"
        }).done(
            function (data) {
                data.results.forEach(function (movies) {

                    $("#moviesContainer").append(`
                        <a href="/movieDetails?id=${movies.id}">             
                            <article>
                                <h2>${movies.title}</h2>
                                <p>
                                <img style="height: 500px"
                                class="logo" src="https://image.tmdb.org/t/p/original/${movies.poster_path}" alt="NO IMAGE??">
                                </p>
                            </article>
                        </a>
                        `);
                }

                );
            }
        ).fail()
    }
    console.log(sessionStorage.userId)
    if (sessionStorage.length < 2) {
        $('.loginReg').append(`
        
        `)

    } else {
        $('.loginReg').hide()
        $('.logout').append(`
        <a href="/account?token=${sessionStorage.authToken}">Your profile</a>

        <button class="logoutBtn">Logout</button>
        <a href="/manage?token=${sessionStorage.authToken}">Manage Website</a>
        `)
    }

    // getting cinema location
    $.ajax({
        url: 'https://developers.onemap.sg/commonapi/search?searchVal=cathay cineplex&returnGeom=Y&getAddrDetails=Y',
        method: "get"
    }).done(

        function (data) {
            console.log(data.results);
            var counter = 0
            data.results.forEach(element => {
                // lat lng clr , name
                points = [element.LATITUDE, element.LONGITUDE, '"' + colour + '"',]
                listOfPoints.push('[' + points + ']');
                counter++


            });

        },

        // get other cinema
        $.ajax({
            url: 'https://developers.onemap.sg/commonapi/search?searchVal=shaw theatres&returnGeom=Y&getAddrDetails=Y',
            method: "get"
        }).done(
            function (data) {
                var counter = listOfPoints.length
                console.log(data.results);
                data.results.forEach(element => {
                    // lat lng clr , name

                    points = [element.LATITUDE, element.LONGITUDE, '"' + colour + '"',]
                    listOfPoints.push('[' + points + ']');
                    counter++


                });
                listOfPoints = listOfPoints.join("|");



            },
        )
    )
     // gDisplaying map
    $.ajax({
        url: 'https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&lat=1.31955&lng=103.84223&zoom=11&height=500&width=500&points=[1.31955,103.84223,"255,255,178","B"]|[1.31801,103.84224,"175,50,0","A"]',
        method: "get"
    }).done(
        function (data) {
            console.log(listOfPoints)
            var img = document.createElement('img');
            // var converted = data.toString('base64')
            img.src = 'https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&lat=1.31955&lng=103.84223&zoom=11&height=500&width=500&points=' + listOfPoints;
            document.getElementById("maps").appendChild(img)

    });

}
)




// Show feedback form
$(".addMovieBtn").click(function () {
    $(".addMovie").show();
}),
$(".loginBtn").click(function () {
    console.log("clicking")
    $(".loginForm").show();
    $(".registerForm").hide()
    $(".loginBtn").hide()
    $(".registerBtn").show()
}),
$(".registerBtn").click(function () {
    $(".registerForm").show();
    $(".loginForm").hide()
    $(".registerBtn").hide()
    $(".loginBtn").show()
})
$(".mapsBtn").click(function(){
    $("#maps").show();
})





function addFeedback() {
    var feedback = {
        email: $('#email').val(),
        title: $('#title').val(),
        feedback: $('#feedback').val(),
    }
    $.ajax({
        url: '/submitFeedback',
        method: "post",
        data: feedback

    })
        .done(
            alert("Feedback submitted!")

        )
        .fail()


}




