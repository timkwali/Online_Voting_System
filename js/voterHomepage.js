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
  $("#details").append(`<p> NAME: ${voter["firstName"]} ${voter["lastName"]} </p>`)
  $("#details").append(`<p> GENDER: ${voter["gender"]} </p>`)
  $("#details").append(`<p> REGISTRATION NUMBER: ${voter["registrationNumber"]} </p>`)
  $("#details").append(`<p> AGE: ${voter["age"]} </p>`)
  $("#details").append(`<p> HAS VOTED: ${voter["hasVoted"]} </p>`)
  $("#details").append(`<button>GOTO VOTE</button>`)
  $("#details").css("color", "green")
  $("button").click(function() {
    //goto voting page
    if(voter["hasVoted"] === "NO") {
      window.location.href = "votingPage.html"
    } else {
      alert("You have already voted, you cannot be allowed to vote again!")
    }
  })
}

$("#voterHome").on("load", getVoter() )