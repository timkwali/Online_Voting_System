$(document).ready(function() {
  $("#admin").click(function() {
    window.location.href = "adminSignIn.html"
  })

  console.log("hi")
  const showElectionDeadline = () => {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/deadline/1",
      success: function(deadline) {
        $("#electionDeadline1").text("");
        $("#electionDeadline2").text("");
        $("#electionDeadline3").text("");
        $("#electionDeadline1").append(`<p class="inf">ELECTION DEADLINE</p>`);
        $("#electionDeadline2").append(`<p class="inf">${deadline["date"]}</p>`)
        $("#electionDeadline3").append(`<p class="inf">${deadline["time"]}</p>`)
        anounceElectionWinner(deadline);
      },
      error: function() {
        alert("error getting deadline info")
      }
    })
  }
  
  const anounceElectionWinner = (deadline) => {
    //set up deadline
    let dead = deadline;
    let dateParts = dead["date"].split("-");
    let timeParts = dead["time"].split(":");
    deadlineDate = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1] ); 
    deadlineDate = deadlineDate.getTime(); //convert to timestamp
    
    let checkDeadline = setInterval(function() {
      //set up current date
      let currentdate = new Date();
      datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " @ " 
        + currentdate.getHours() + ":" + currentdate.getMinutes()
      currentdate = new Date(datetime);
      //convert to timestamp
      currentdate = currentdate.getTime();
      if(currentdate >= deadlineDate) {
        deadline["reached"] = "YES";
        
        //send new deadline value to database
        $.ajax({
          type: "PUT",
          url: "http://localhost:3000/deadline/1",
          data: deadline,
          success: function() {
            //alert("election deadline reached");
            $("#electionDeadline1").text("");
            $("#electionDeadline2").text("");
            $("#electionDeadline3").text("");
            $("#electionDeadline3").append("Election Closed")
            //window.location.replace("homepage.html")
            checkElectionResult();
          },
          error: function() {
            alert("error updating database")
          }
        })
        clearInterval(checkDeadline)
      } 
    }, 1000)
  }

  const checkElectionResult = () => {
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: `http://localhost:3000/candidates`,
      success: function(candidates) {
        let mostVotes = 0;
        let winner= [];
        //get most number of received votes
        candidates.forEach(candidate => {
          if( parseInt(candidate["votes"]) > mostVotes) {
            mostVotes = parseInt(candidate["votes"]);
          }  
        })
        //get the candidate(s) with the most votes
        candidates.forEach(candidate => {
          if( parseInt(candidate["votes"]) === mostVotes) {
            winner.push(`${candidate["firstName"]} ${candidate["lastName"]}`)
          }
        })
        //display election results
        $("#results").text("");
        candidates.forEach(candidate => {
          if(parseInt(candidate["votes"]) === mostVotes) {
            let p = $("<p/>").css("color", "red");
            $("#results").append(p.text(`${candidate["firstName"]} ${candidate["lastName"]}: ${candidate["votes"]} VOTES`).clone());
          } else {
            let p = $("<p/>").css("color", `rgb(21, 214, 0)`);
            $("#results").append(p.text(`${candidate["firstName"]} ${candidate["lastName"]}: ${candidate["votes"]} VOTES`).clone());
          }
        })
        //declare winner(s) of the election
        if(winner.length === 1) {
            $("#electionWinner").append(`<a href="electionResults.html">BREAKING NEWS: ${winner[0]} WINS THE ELECTION</a>`)
        } else {
          let message = "BREAKING NEWS: ELECTION ENDS IN A DRAW BETWEEN "
          winner.forEach(win => {
            message += win + " AND ";
          })
          message = message.slice(0, -4);
            $("#electionWinner").append(`<a href="electionResults.html">${message}</a>`);
        }
      },
      error: function() {
        alert("Something went wrong")
      }
    })
  }

  $("body").on("load", showElectionDeadline());
})

