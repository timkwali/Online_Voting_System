let voter;
let voterId;
let candidateId;
let allCandidates;
let selectedCandidate;

const getCandidates = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/candidates",
    success: function(candidates) {
      allCandidates = candidates;
      showCandidates(candidates)
    },
    error: function() {
      alert("Something went wrong")
    }
  })
}

const showCandidates = (candidates) => {
  for(candidate of candidates) {
    let box = $(`<div/>`, {"id": `box${candidate["id"]}`, "class": "box"})
    let party = $(`<p/>`, {"id": `party${candidate["id"]}`, "class": "party"})
    let name = $(`<label/>`, {"id": `name${candidate["id"]}`, "class": "name", "for": `input${candidate["id"]}`})
    let input = $(`<input/>`, {"id": `input${candidate["id"]}`, "class": "input", "type": "radio", "name": "candidates"})
    $("#cand").append(box.clone());
    $(`#box${candidate["id"]}`).append(party.text(candidate["party"]))
    $(`#box${candidate["id"]}`).append(name.text(`${candidate["firstName"]} ${candidate["lastName"]}`))
    $(`#box${candidate["id"]}`).append(input)
  };
  
  //vote for candidate
  let input = document.querySelectorAll(".input");
  input = [...input];
  $("button").click(function() {
    event.preventDefault();
    if(!input.some(inpt =>  inpt.checked )) {
      //no candidate is selected
      alert("Please Select a candidate") 
    } else {
      getSelectedCandidate(input)
    }
  })
}

const getSelectedCandidate = (input) => {
  for(inpt of input) {
    if(inpt.checked) {
      candidateId = inpt.id.slice("-1");
      for(candidate of allCandidates) {
        if(candidate["id"] === parseInt(candidateId) ) {
          if(confirm(`Are you sure you want to vote for ${candidate["firstName"]} ${candidate["lastName"]}`) ) {
            candidate["votes"] = parseInt(candidate["votes"]) + 1;
            selectedCandidate = candidate;
            getVoterId();
            updateCandidateData();
            setTimeout(function() {
              window.location.replace("homepage.html");
            }, 100)
          }
        }
      }
    }
  }
}

const getVoterId = () => {
  //get current voter id from temporary storage
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/temp/1",
    success: function(votr) {
      voterId = votr["identity"]
      getVoterInfo(voterId)
    },
    error: function() {
      alert("Unable to get voter id")
    }
  })  
}

const getVoterInfo = (voterId) => {
  //get current voter info using id from above
  $.ajax({
    type: "GET",
    url: `http://localhost:3000/voters/${voterId}`,
    success: function(votr) {
      votr["hasVoted"] = "YES";
      voter = votr;
      updateVoterStatus(voter, voterId);
    },
    error: function() {
      alert("Unable to get voter info")
    }
  })
}

const updateVoterStatus = (voter, voterId) => {
  $.ajax({
    type: "PUT",
    url: `http:localhost:3000/voters/${voterId}`,
    data: voter,
    success: function() {
      console.log("successfully updated voter status")
    },
    error: function() {
      alert("unable to update voter status")
    }
  })
}

const updateCandidateData = () => {
  $.ajax({
    type: "PUT",
    url: `http://localhost:3000/candidates/${candidateId}`,
    data: selectedCandidate,
    success: function() {
      alert("Voting successfull")
    },
    error: function() {
      alert("Unable to add candidate vote")
    }
  })
}

$("body").on("load", getCandidates());

$(document).ready(function() {
  $("body").on("load", showElectionDeadline());
})