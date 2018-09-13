var buttons_array=['dog','cat','hamster','pig','cow','horse','sheep','goat','monkey','elephant','gorilla','bird'];
var display_array=[];
function create_button(value){
  var button = $('<button>');
  button.attr('data-animal',value).text(value.toUpperCase());
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
        var animal = $(this).attr("data-animal");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        animal + "&api_key=uknKwO04LXtdhgkiguIRaGMsSDdXgF5l&limit=10";
        if($.inArray(animal,display_array)===-1){
          display_array.push(animal);
        }else{//already searched
          alert("You've already searched for '"+animal+"'");
          scrollToId(animal);
          return false;
        }
        $.ajax({
          url: queryURL,
          method: "GET"
        })
        .then(function(response) {
          var results = response.data;
          var search_q = $('<div id="'+animal+'" class="search_q">'),search_q_inner1=$('<div class="search_q_inner1">'),search_q_inner2=$('<div class="search_q_inner2">');
          search_q_inner2.text(animal.toUpperCase());
          search_q_inner1.append(search_q_inner2);
          search_q.append(search_q_inner1);

          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
            var title = results[i].title, rating = results[i].rating;
            var gifDiv = $("<div class='item'>"), p_title = $("<p class='title'>").text(title), p_rating = $("<p class='rating'>").text("Rating: " + rating);
            //image
            var animalImage = $("<img>");animalImage.attr("src", results[i].images.fixed_height_still.url).attr("data-state", "still").attr("data-still", results[i].images.fixed_height_still.url).attr("data-animate", results[i].images.fixed_height.url);
            
            gifDiv.prepend(animalImage);
            gifDiv.prepend(p_rating);
            gifDiv.prepend(p_title);
            $("#gifs-appear-here").prepend(gifDiv);
          }
          $("#gifs-appear-here").prepend(search_q);
        });
    });
    $("#gifs-appear-here").on("click",'img', function() {
      var parent_div=$(this).parent();
      var state = $(this).attr("data-state");
      if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
        parent_div.css({'border':'2px solid red'});
      } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
        parent_div.css({'border':'1px solid #e2e2e2'});
      }
    });
    $('.add_animal_input').keypress(function(e){
      if(e.which===13){
        if($(this).val().trim()===""){
          $(this).val('');
        } else{
          $('.add_animal_btn').click();
        }   
      }
    })
    $('.add_animal_btn').on('click',function(e){
      e.preventDefault();
      var new_animal = $('.add_animal_input').val().trim();
      if($.inArray(new_animal,buttons_array)===-1){
        buttons_array.push(new_animal);
      }else{//already searched
        alert("'"+new_animal.toUpperCase()+"' has already been in buttons");
        $('.add_animal_input').val('');
        flash($("button[data-animal='"+new_animal+"']"));
        return false;
      }

      new_button = create_button(new_animal);
      $('#buttons').append(new_button);
      $('.add_animal_input').val('');
    })
})