var searchParams = new URLSearchParams(window.location.search)
var movieId = searchParams.get('id');
var genreArray = [];
var movies;
var baseURL = 'https://api.themoviedb.org/3/'
var api_key = '?api_key=d531746f62591cbf027fc279fd5d3c44'
var google_key = 'AIzaSyBINaBNQu8Bj_WOxDgVuDu4uTX580PfMuk'

$(function () {
    // Getting video info
    $.ajax({
        url: baseURL + 'movie/' + movieId + '/videos' + api_key,
        method: "get"
    }).done(
        function (videoRes) {
            $.ajax({
                url: "https://www.googleapis.com/youtube/v3/videos?part=player&id=" + videoRes.results[0].key + "&key=" + google_key,
                method: "get"
            })
                .done(
                    function (theVideo) {
                        $(".trailer").append(`${theVideo.items[0].player.embedHtml}`)
                    },
                    $.ajax({
                        url: "https://www.googleapis.com/youtube/v3/commentThreads?key=" + google_key + "&textFormat=plainText&part=snippet&videoId=" + videoRes.results[0].key + "&maxResults=5",
                        method: "get"
                    }).done(
                        function (theComments) {

                            theComments.items.forEach(function (comment) {
                                console.log("Comment loaded")
                                let obj = comment.snippet.topLevelComment.snippet
                                let author = obj.authorDisplayName
                                let authorPic = obj.authorProfileImageUrl
                                let text = obj.textOriginal

                                $(".YoutubeComments").append(`
                        
                        <div style="display:flex; width=500px">
                            <div>
                                <img src="${authorPic}" alt="authorPic">
                            </div>
                            
                            <div>
                                <b>${author}</b> 
                                <br>
                                <em>${text}</em>
                            </div>
                        </div>
                        `)

                            })

                        },
                    ).fail(),

                )
                .fail()

        }


    ).fail()
    // Getting movie info
    $.ajax({
        url: baseURL + 'movie/' + movieId + api_key,
        method: "get"
    }).done(
        function (movies) {

            if (movies.id == movieId) {
                i = 0
                // use nested
                while (i < movies.genres.length) {
                    genreArray.push(movies.genres[i].name)
                    i++
                }
                $("article").append(`
                        ${movies.id}
                        <header id="movieTitle">${movies.title}</header>    

                        
                
                        <div class="movieDetails">
                            <div><img id="moviePoster" style="height: 500px;" src="https://image.tmdb.org/t/p/original/${movies.poster_path}" alt="the image goes here"></div>
                            <div>Title: ${movies.title},<br>Genre:${genreArray}<br>Release Date:${movies.release_date} <br>Duration of movie:${movies.runtime}mins<br>Rating: ${movies.vote_average}/10</div>
                        </div>
                
                        <section class="movieDescription">
                          ${movies.overview}
                        </section>                     
                        
                        
                        `)


            }
            ;
        }
    ).fail()

    // Getting reviews
    $.ajax({
        url: "/reviews/" + movieId,
        method: "get"
    }).done(
        function (reviews) {
            // console.log("/reviews/"+movieId)
            // console.log(reviews)
            reviews.forEach(function (reviews) {
                $(".reviews").append(`
                <p>
                    <b>Author : </b><br>${reviews.Author}<br>
                    <b>Title:</b> ${reviews.Title}<br>
                    <b>Review:</b> ${reviews.Review}<br>
                </p>
                `)
            });
        }
    ).fail()



    // no one is logged in
    if (sessionStorage.length > 1) {
        $('.reviews').append(`
        <form onsubmit="return addReview();">
        <label for="title">Review Title</label>
        <input type="text" id="title" name="title"><br>
        <label for="review">Review:</label>
        <input type="text" id="review" name="review"><br>
        <input type="submit" value="Submit">
            </form>
        `)
    }






})


function addReview() {
    var movie = {
        movieId: movieId,
        title: $("#title").val(),
        review: $("#review").val(),
        userId: sessionStorage.userId

    };
    $.ajax(
        {
<<<<<<< Updated upstream
            url: '/account/submitReview?token=' + sessionStorage.authToken,
=======
            url: '/p/submitReview',
>>>>>>> Stashed changes
            method: 'post',
            data: movie
        }
    ).done(
        function (data) {
            alert("Review submitted!");
            window.location.href = "/";


        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );
    return false;
}