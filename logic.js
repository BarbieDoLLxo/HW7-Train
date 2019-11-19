$(document).ready(function() {
    var config = {
      apiKey: "AIzaSyA4ibeyTije2SKL8hig6Ell09rWGQbM6GY",
      authDomain: "train-station-ba27d.firebaseapp.com",
      databaseURL: "https://train-station-ba27d.firebaseio.com",
      projectId: "train-station-ba27d",
      storageBucket: "train-station-ba27d.appspot.com",
      messagingSenderId: "829898611978",
      appId: "1:829898611978:web:bf631f70451d6cd2"
    };
    firebase.initializeApp(config);
  
    var database = firebase.database();
  
    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;
  
    $("#add-train").on("click", function() {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#TrainName").val().trim();
        destination = $("#Destination").val().trim();
        firstTrain = $("#TrainTime").val().trim();
        frequency = $("#Frequency").val().trim();
      // temporary object for holding new train data 
      var tempTrain = {
      name:name,
      destination:destination,
      firstTrain:firstTrain,
      frequency:frequency
      };
  
        // Pushing to database
        database.ref().push(tempTrain)
          console.log(tempTrain.name)
        
        
      
    });
  
    database.ref().on("child_added", function(childSnapshot) {
       
        var minAway;
        // Chang year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");
  
        $("#Current-Train-table").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");
  
            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });
  });