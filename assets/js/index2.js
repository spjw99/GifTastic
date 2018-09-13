var buttons_array=['Avengers: Infinity War','Black Panther','Jurassic World: Fallen Kingdom','Incredibles 2','Deadpool 2','Fallout Paramount'];
var display_array=[];
function create_button(value){
  var button = $('<button>');
  button.attr('data-movie',value).text(value.toUpperCase());
  return button;
}
function scrollToId(id){$('html, body').animate({scrollTop: $("#"+id).offset().top}, 2000);}
function flash(obj){
  obj.fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
}
$(document).ready(function(){
    var new_button;
    for(var i=0;i<buttons_array.length;i++){
      new_button = create_button(buttons_array[i]);
      $('#buttons').append(new_button);
    }
    $("#buttons").on("click", "button",function() {
        var movie = $(this).attr("data-movie");
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        
        if($.inArray(movie,display_array)===-1){
          display_array.push(movie);
        }else{//already searched
          alert("You've already searched for '"+movie+"'");
          scrollToId(movie);
          return false;
        }
        $.ajax({
          url: queryURL,
          method: "GET"
        })
        .then(function(response) {
            console.log(response);
            if(response.Response!=="False"){
                var title = response.Title, rating = response.Rated, released = response.Released, plot = response.Plot, poster = response.Poster, website_url = response.Website;

                var movieDiv = $("<div class='item movie_item'>"), 
                div_title = $("<div class='title'>").html(title.toUpperCase()),
                div_rating = $("<div class='rating'>").html("<b>RATING:</b> " + rating.toUpperCase()),
                div_released = $("<div class='released'>").html("<b>RELEASED:</b> " + released),
                div_plot = $("<div class='plot'>").html("<b>PLOT:</b> " + plot),
                website_link = $("<a>");website_link.attr('href',website_url).attr('target','_blank'),
                posterImage = $("<img>");posterImage.attr("src", poster);
                website_link.append(posterImage);
                movieDiv.prepend(website_link).prepend(div_plot).prepend(div_released).prepend(div_rating).prepend(div_title);
                
                $("#movie-appear-here").prepend(movieDiv);
            }else{
                alert(response.Error);return false;
            }
            
        });
    });
    $("#movie-appear-here").on("mouseover",'img', function() {
        var parent_div=$(this).parent().parent();
        parent_div.css({'border':'2px solid red'});
    });
    $("#movie-appear-here").on("mouseout",'img', function() {
        var parent_div=$(this).parent().parent();
        parent_div.css({'border':'1px solid #e2e2e2'});
    });
    $('.add_movie_input').keypress(function(e){
      if(e.which===13){
        if($(this).val().trim()===""){
          $(this).val('');
        } else{
          $('.add_movie_btn').click();
        }   
      }
    })
    $('.add_movie_btn').on('click',function(e){
      e.preventDefault();
      var new_movie = $('.add_movie_input').val().trim();
      if($.inArray(new_movie,buttons_array)===-1){
        buttons_array.push(new_movie);
      }else{//already searched
        alert("'"+new_movie.toUpperCase()+"' has already been in buttons");
        $('.add_movie_input').val('');
        flash($("button[data-movie='"+new_movie+"']"));
        return false;
      }

      new_button = create_button(new_movie);
      $('#buttons').append(new_button);
      $('.add_movie_input').val('');
    })
})