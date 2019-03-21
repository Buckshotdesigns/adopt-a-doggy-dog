/*  This javascript dynamically generates results from petfinder api (dog pics and details from adoption results) and dog breed description 
    from wiki api based on a breed drop dowmn menu option selected by user. */

/*  This array contains parameters that should be used for search of dog breed descriptions thru wiki api (dog name and the pagenumber). */

var dogBreed = [
    {
        dog: "pit_bull",
        pagenumber: "64235",
    },
    {
        dog: "chihuahua_(dog)",
        pagenumber: "26998504",
    },
    {
        dog: "boxer_(dog)",
        pagenumber: "253409",
    },
    {
        dog: "bulldog",
        pagenumber: "242068",
    },
    {
        dog: "pug",
        pagenumber: "21234727",
    },
    {
        dog: "wolverine",
        pagenumber: "123"
    }
];
// Sets parameters for spin.js spinner
var opts = {
    lines: 10, // The number of lines to draw
    length: 7, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 25, // Top position relative to parent in px
    left: 25 // Left position relative to parent in px
};
//  Global variables for responses from petfinder.com api
var timerHandle = 0;
var dogPage;
var results;
var title;
var dogResponse;
var spinner;
var modalArray = [];
function displayAll() {
    spinner.stop();

    $("#pet_description").prepend("<div id = \"title\"><h5>" + title.toString() + "</h5><p id = \"paragraph\">" +
    results.toString() + "</p></div>");

    for (var i = 0; i < 4; i++) {
        var dogData = dogResponse.petfinder.pets.pet[i];
        var dogPhoto = dogData.media.photos.photo[2].$t;
        var dogName = dogData.name.$t;
        var dogLocation = dogData.contact.city.$t;
        var dogPhone = dogData.contact.phone.$t;
        var dogEmail = dogData.contact.email.$t;
        var dogDescription = dogData.description.$t;
        var dogAge = dogData.age.$t;
        var dogGender = dogData.sex.$t;
        
        
        //sanitize nulls
        if(!dogName) {
            dogName = "Not Available";
        }
        if(!dogLocation) {
            dogLocation = "Not Available";
        }
        if(!dogPhone) {
            dogPhone = "Not Available";
        }
        if(!dogPhoto) {
            dogPhoto = "";
        }
        if(!dogEmail)   {
            dogEmail = "Not Available";
        }

        // console.log("dog photo = " + dogPhoto);
        // console.log("i = " + i);

        var result = ""
            + "<div class=\"col-sm-3 pic\">" 
                + "<p><b>" + dogName.toString() + "</b></p>"
                + "<p>" + dogLocation.toString() + "</p>"
                + "<p>" + dogPhone.toString() + "</p>"
                + "<p id = \"dogemail\">" + dogEmail.toString() + "</p>"
                + "<img id=\"dog-pic\""
                    + " src=" + dogPhoto.toString() 
                    + " class = \"dogImage\">"
            + "</div>";
        $("#results").prepend(result);
        $("#dog-pic").attr({"data-name": dogName, "data-age": dogAge,"data-gender": dogGender,"data-description": dogDescription,});

    }
}

           
$(document).ready(function () {
    $(".dropdown-item").on("click", function (event) {
        var target = document.getElementById("spinner");
        spinner = new Spinner(opts).spin(target);

                //  This clears results before running all api get calls.

                $("#pet_description").empty();
                $("#results").empty();
        
        //  This funciton is called when user selects a dog breed from the drop down menu.
        //  This sets up all variables for api get calls.

        var breed = $(this).attr("value"); // To be replaced with values from the select box.

        //Generate API URLs for Petfinder and Wikipedia.

        var pfApiKey = "3b7e9ed23b598ca17ae1d73381f1544f";
        var pfUrl = "https://api.petfinder.com/pet.find?key=" + pfApiKey + "&location=44113&status=A&breed=" + breed + "&count=6&output=basic&format=json";
        var getDog = [$(this).attr("data-value")];
        var queryUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&action=query&prop=extracts&exintro&explaintext&redirects=5&titles=" + dogBreed[getDog].dog;

        //  This activates pop-up message when user enters wolverine

        if (breed == "myModal") {
            $("#myModal").modal();
            spinner.stop();
        } else {
            // Wikipedia API call.
            $.ajax({
                url: queryUrl,
                method: "GET"
            })
            .then(function (response) {
                 // this call is to fix a bug where petfinder and Wiki returns two sets of results
                $("#pet_description").empty();
                $("#results").empty();
                window.clearTimeout(timerHandle);
                timerHandle = window.setTimeout(displayAll, 500);
                console.log("This is wiki response: ");
                console.log(response);
                dogPage = dogBreed[getDog].pagenumber;
                results = response.query.pages[dogPage].extract;
                title = response.query.pages[dogPage].title;
            });

            // Petfinder API call.
            $.ajax({
                url: pfUrl,
                dataType: 'jsonp',
                method: "GET"
            }).then(function (response) {
                console.log("This is Pet Finder response: ");
                console.log(response);
                // this call is to fix a bug where petfinder and Wiki returns two sets of results
                $("#pet_description").empty();
                $("#results").empty();
                window.clearTimeout(timerHandle);
                timerHandle = window.setTimeout(displayAll, 500);
                dogResponse = response;
            });
        }
        
})

       
});

    
        var modal = $("#bryansModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        
        var modalImg = $("#img01");
        var captionText = $("#caption");

        $("body").on("click", "#dog-pic" , function(){
            
            $("#caption").empty();
            modal.css("display","block");
            modalImg.attr("src", this.src);
           
            dataName = $(this).attr("data-name");
            dataDescription = $(this).attr("data-description");
            dataAge = $(this).attr("data-age");
            dataGender = $(this).attr("data-gender");

            captionText.append("<h3>" + dataName + "</h3>");
            captionText.append("<h3> Age :  " + dataAge + "</h3>");
            captionText.append("<h3> Gender:  " + dataGender + "</h3>");
            captionText.append(dataDescription);


        });

        // Get the <span> element that closes the modal
        var span = $(".close-now")[0];

        // When the user clicks on <span> (x), close the modal
        $(".close-now").on("click" , function() { 
            
            modal.css("display", "none");
        });
   
