const checkElectionResult = () => {
  //event.preventDefault();
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
    },
    error: function() {
      alert("Something went wrong")
    }
  })
}

$(document).ready(function() {
  $("body").on("load", checkElectionResult() );
  $("body").on("load", showElectionDeadline() );
})