$(document).ready(function(){
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCBxvdJxSSmDsuN1AzA3zNRizixjUNq9Tc",
    authDomain: "plane-scheduler.firebaseapp.com",
    databaseURL: "https://plane-scheduler.firebaseio.com",
    storageBucket: "plane-scheduler.appspot.com",
    messagingSenderId: "951268444059"
  };
  firebase.initializeApp(config);

  //getting current time to display
  var userTime = moment().format('MMM Do YYYY, h:mm:ss a');
  $("#userTime").append(userTime);

  var database = firebase.database();


  //Initial Values
  var flight = "";
  var destination = "";
  var flightTime = 0;
  var frequency = 0;

//Capture the information into the forms when the button is click

    $("#add-flight").on("click", function(event){
        //event.preventdefault keeps it from adding again if clicked more than once (clears form)
        event.preventDefault();
        //console.log(event);

        flight = $("#flight-input").val().trim();
        destination = $("#destination").val().trim();
        flightTime = $("#flight-time").val().trim();
        frequency = $("#frequency").val().trim();

//pushes the entered data when user clicks on button
        database.ref().push({
            flight: flight,
            destination: destination,
            flightTime: flightTime,
            frequency: frequency

        });

        $("flight-input").val(" ");
        $("destination").val(" ");
        $("flight-time").val(" ");
        $("frequency").val(" ");
   });
    database.ref().on("child_added", function(childSnapshot){

      //Store all snapshots into a variable
      var flightName = childSnapshot.val().flight;
      var flightDestination = childSnapshot.val().destination;
      var flightFrequency = childSnapshot.val().frequency;
      var firstFlight = childSnapshot.val().flightTime;


      //creating variables to calculate the time with momentJS
      var differenceTimes = moment().diff(moment.unix(firstFlight), "minutes");
      var remainder = moment().diff(moment.unix(firstFlight), "minutes") % flightFrequency;
      var minutes = flightFrequency - remainder;

      var arrival = moment().add(minutes, "m").format("hh:mm A");

//Figure out the minutes away. how to append the new table row in the div with moment js function


  //appends the data entered in the form
      $("#table").append(
          "<tr>" +
            "<td>" + flightName + "</td>" +
            "<td>" + flightDestination + "</td>" +
            "<td>" + flightFrequency + "</td>" +
            "<td>" + firstFlight + "</td>" +
            "<td>" + arrival + "</td>" +
            "<td>" + minutes + "</td>" + "</tr>"
        );


      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
});