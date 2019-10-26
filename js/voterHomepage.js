const getVoter = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/temp/1",
    success: function(voter) {
      showVoterDetails(voter)
    },
    error: function() {
      alert("Something went wrong")
    }
  })
}

const showVoterDetails = (voter) => {
  setTimeout(function() {
    alert(`Welcome, ${voter["firstName"]} ${voter["lastName"]}`)
  }, 100);
  //show voter picture
  let voterImage = voter["image"];
  voterImage = [...voterImage];
  const index = voterImage.lastIndexOf("\\");
  const voterText = voterImage.slice(index + 1).join("");
  $("#picture").css("background-image", `url(images/${voterText})`)
  
  //fill out voter details
  $("#details").append(`<p> NAME: ${voter["firstName"]} ${voter["lastName"]} </p>`)
  $("#details").append(`<p> GENDER: ${voter["gender"]} </p>`)
  $("#details").append(`<p> REGISTRATION NUMBER: ${voter["registrationNumber"]} </p>`)
  $("#details").append(`<p> AGE: ${voter["age"]} </p>`)
  $("#details").append(`<p> HAS VOTED: ${voter["hasVoted"]} </p>`)
  $("#details").append(`<button>GOTO VOTE</button>`)
  $("#details").css("color", "green")
  $("button").click(function() {
    //goto voting page
    getDeadlineInfo(voter)
  })
}

const getDeadlineInfo = (voter) => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/deadline/1",
    success: function(deadline) {
      if(deadline["reached"] === "NO") {
        if(voter["hasVoted"] === "NO") {
          window.location.href = "votingPage.html"
        } else {
          alert("You have already voted, you cannot be allowed to vote again!")
        }
      } else {
        alert("Voting deadline reached. All voting have been closed")
      }
    },
    error: function() {
      alert("error getting deadline info")
    }
  })
}

$("#voterHome").on("load", getVoter() )

$(document).ready(function() {
  $("body").on("load", showElectionDeadline() )
})