$(() => {
  if(loadMovies()){
    console.log("Working")
  }
  else{
    console.log("Didn't work Load Movies Function")
  }
  $("#movies").on("click", ".btn-danger", handleDelete);
  $("#movies").on("click", ".btn-primary", handleUpdate);
  $("#addBtn").click(addMovie);
  $("#updateSave").click((event) =>{
    var id = $("#updateId").val();
    var name = $("#updateName").val();
    var description = $("#updateDescription").val();
    var year = $("#updateYear").val();
     var image = $("#updateImage").val();
    event.preventDefault();
    $.ajax({
      url: `http://localhost:3500/movies/${id}`,
      data: {name, year, description,image},
      method: "PATCH",
      success: (response) =>{
        console.log(response);
        console.log("PUT Method")
        loadMovies();
        $("#updateModal").modal("hide");
        
      }
    });
  });
});
function handleUpdate(){
  var btn = $(this);
  var parentDiv = btn.closest(".movieCard");
  let id = parentDiv.attr("data-id");
  console.log(id);
  $.get("http://localhost:3500/movies/" + id, (response) => {
    $("#updateId").val(response._id);
    $("#updateName").val(response.name);
    $("#updateDescription").val(response.description);
    $("#updateYear").val(response.year);
     $("#updateImage").val(response.image);
    $("#updateModal").modal("show");
  });
}
function addMovie() {
  var name = $("#name").val();
  var year = $("#year").val();
  var description = $("#description").val();
  var image = $(".image").val();
  $.ajax({
    url: "http://localhost:3500/movies",
    method: "POST",
    data: {name, year, description,image},
     error:(response) =>{
      console.log("Error in Post Method")
      console.log(response.data)
    },
    success: (response) => {
      console.log("Working");
      console.log(response);
      $("#name").val("");
      $("#year").val("");
      $("#description").val("");
       $("#image").val("");
      loadMovies();
      $("#addModal").modal("hide");
    }
  });
}
function handleDelete() {
  var btn = $(this);
  var parentDiv = btn.closest(".movieCard");
  let id = parentDiv.attr("data-id");
  console.log(id);
  $.ajax({
    url: "http://localhost:3500/movies/" + id,
    method: "DELETE",
    error:(response) =>{
      console.log("ughhh")
      console.log(response)
    },
    success: () => {
      loadMovies();
    }
  });
}
function loadMovies(){
  $.ajax({
    url: "http://localhost:3500/movies",
    method: "GET",
    error: (response) =>{
      var movies = $("#movies");
      movies.html("An Error has occured");
      console.log(response)
    },
    success: (response) =>{
      console.log(response);
      var movies = $("#movies");
      movies.empty();
      
      for (var i = 0; i < response.length; i++) {
        var rec = response[i];
        movies.append(
          `<div class="col-sm-3 shadow m-4 p-4" >
            <div class="movieCard" data-id="${response[i]._id}">
              <img style="width:100%" srcset="http://localhost:3500/uploads/${response[i].image}"/>
              <div class="p-2 movie-details">
                <h2 class="name" >${response[i].name}</h2>
                <span class="year" >${response[i].year}</span>
                <p> ${response[i].description}</p>
              </div>
              <div class="btn-container" style="text-align:center">
                <button
                  class="own-btn btn-primary"
                  data-toggle="modal"
                  data-target="#updateModal"
                >
                  Edit
                </button>
                <button 
                class="own-btn btn-danger">Delete</button>
              </div>
            </div>
          </div>`
        );
      }
    }
  });
}
