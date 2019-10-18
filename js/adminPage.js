$(document).ready(function() {

  const registerCandidate = () => {
    event.preventDefault();
    if($("#age").val() < 18) {
      alert("Candidate must be 18 years and above!")
    } else {
      let candidate = {
        "firstName": $("#firstName").val().toUpperCase(),
        "lastName": $("#lastName").val().toUpperCase(),
        "age": $("#age").val(),
        "party": $("#party").val(),
        "gender": $("#gender").val(),
        "candidateImage": $("#candidateImage").val(),
        "partyImage": $("#partyImage").val(),
        "votes": 0
      }
      $.ajax({
        type: "POST",
        url:"http://localhost:3000/candidates",
        data: candidate,
        success: function() {
          document.location.reload()
          alert("Successfully registered candidate");
        },
        error: function() {
          alert("Something went wrong!")
        }
      })
    }
    
  }

  const viewCandidates = () => {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/candidates",
      success: function(candidates) {
        let name = $("<button/>", {"class": "candidateButton"})
        //show candidate names
        candidates.forEach(candidate => {
          name.text(`${candidate["firstName"]} ${candidate["lastName"]}`)
          $(".names").append(name.clone())
          $(".info").css("background-image", `url(images/inecLogo2.jpg)`)
          $(".info").css("background-size", `cover`)
        }) 
        showCandidateDetails(candidates);
      },
      error: function() {
        alert("Something went wrong");
      }
    })
  }

  const showCandidateDetails = (candidates) => {
    let buttons = document.querySelectorAll(".candidateButton");
    buttons.forEach(button => {
      button.addEventListener("click", function() {
        candidates.forEach(candidate => {
          if(button.innerHTML === `${candidate["firstName"]} ${candidate["lastName"]}`) {
            $(".info").css("background-image", `none`)
            //show candidate images
            let candImage = candidate["candidateImage"];
            let partyImage = candidate["partyImage"];
            candImage = [...candImage];
            partyImage = [...partyImage];
            const index = candImage.lastIndexOf("\\");
            const candText = candImage.slice(index + 1).join("");
            const partyText = partyImage.slice(index + 1).join("");
            $("#candPic").css("background-image", `url(images/${candText})`)
            $("#partyPic").css("background-image", `url(images/${partyText})`);
            let updateBtn = $("<button/>", {"class": "update"}).text("UPDATE CANDIDATE");
            let deleteBtn = $("<button/>", {"class": "delete"}).text("DELETE CANDIDATE");
            $("#updDel").text("")
            $("#updDel").append(updateBtn);
            $("#updDel").append(deleteBtn);
            //show candidate info
            $("#bottom").css("border-top", "3px solid rgb(21, 214, 0)")
            let p = $("<p/>", {"class": "inf"});
            $("#bottom").text("")
            $("#bottom").append(p.text(`NAME: ${candidate["firstName"]} ${candidate["lastName"]}`).clone())
            $("#bottom").append(p.text(`PARTY: ${candidate["party"]}`).clone());
            $("#bottom").append(p.text(`AGE: ${candidate["age"]}`).clone());
            $("#bottom").append(p.text(`GENDER: ${candidate["gender"]}`).clone());
            $("#bottom").append(p.text(`NUMBER OF VOTES: ${candidate["votes"]}`).clone());
          }
        })
        //delete Candidate
        $(".delete").click(function() {
          deleteCandidate(candidates, button);
        })
        //update Candidate
        $(".update").click(function() {
          updateCandidate(candidates, button);
        })
      })
    })

  }

  const deleteCandidate = (candidates, button) => {
    candidates.forEach(candidate => {
      if(button.innerHTML === `${candidate["firstName"]} ${candidate["lastName"]}`) {
        if( confirm(`Are you sure you want to delete ${candidate["firstName"]} ${candidate["lastName"]}?`) ) {
          $.ajax({
            type: "DELETE",
            url: `http://localhost:3000/candidates/${candidate["id"]}`,
            success: function(data) {
              alert(`You deleted ${candidate["firstName"]} ${candidate["lastName"]}!`)
              $("#candPic").css("background-image", "none");
              $("#partyPic").css("background-image", "none");
              $("#updDel").text("");
              $("#bottom").text("").css("border-top", "none")
              $(".names").text("")
              showCand();
              viewCandidates();
            },
            error: function() {
              alert("Something went wrong");
            }
          })
        } else {
          console.log(`YOU DID NOT DELETE ${candidate["firstName"]} ${candidate["lastName"]}`)
        }
      }
    })
  }

  const updateCandidate = (candidates, button) => {
    candidates.forEach(candidate => {
      if(button.innerHTML === `${candidate["firstName"]} ${candidate["lastName"]}`) {
        $("#candidates").hide();
        $("#updCandidate").show().css("margin-top", "0%");
        $("#updateFirstName").val(candidate["firstName"]);
        $("#updateLastName").val(candidate["lastName"]);
        $("updateAge").val( parseInt(candidate["age"]) );
        $("updateParty").val(candidate["party"]);
        $("updateGender").val(candidate["gender"]);
        $("updateCandidateImage").text(candidate["candidateImage"]);
        $("updatePartyImage").val(candidate["partyImage"]);
      }
    })
    $("#updateCandidateButton").click(function() {
      updateCandidateData(candidates, button);
    })
  }

  const updateCandidateData = (candidates, button) => {
    event.preventDefault();
    if($("#updateAge").val() < 18) {
      alert("Candidate must be 18 years and above!")
    } else {
      let updateData = {
        "firstName": $("#updateFirstName").val().toUpperCase(),
        "lastName": $("#updateLastName").val().toUpperCase(),
        "age": $("#updateAge").val(),
        "party": $("#updateParty").val(),
        "gender": $("#updateGender").val(),
        "candidateImage": $("#updateCandidateImage").val(),
        "partyImage": $("#updatePartyImage").val(),
        "votes": 0
      }
      console.log(button)
      candidates.forEach(candidate => {
        if(button.innerHTML === `${candidate["firstName"]} ${candidate["lastName"]}`) {
          $.ajax({
            type: "PUT",
            url:`http://localhost:3000/candidates/${candidate["id"]}`,
            data: updateData,
            success: function() {
              alert(`Successfully updated candidate ${updateData["firstName"]} ${updateData["lastName"]}`)
              document.location.reload();
            },
            error: function() {
              alert("Something went wrong!")
            }
          })
        }
      })
    }
  }

  const resetformValues = () => {
    $("#updateFirstName").val("");
    $("#updateLastName").val("");
    $("#updateAge").val("");
    $("#updateParty").val("political party");
    $("#updateGender").val("Gender");
    $("#updateCandidateImage").val("");
    $("#updatePartyImage").val("");
  }

  const resetCandidatesCSS = () => {
    $("#candPic").css("background-image", "none");
    $("#partyPic").css("background-image", "none");
    $("#updDel").text("");
    $("#bottom").text("").css("border-top", "none")
    $(".names").text("")
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
        let p = $("<p/>", {"class": "inf"});
        candidates.forEach(candidate => {
          $("#results").text("");
          $("#results").append(p.text(`${candidate["firstName"]} ${candidate["lastName"]}: ${candidate["votes"]} VOTES`));
        })


        //declare winner(s) of the election
        if(winner.length === 1) {
          alert(`The winner of the election is ${winner[0]}`)
        }
      },
      error: function() {
        alert("Something went wrong")
      }
    })
  }

  //show/hide different windows
  const showRegCand = () => {
    $("#updCandidate").hide();
    $("#candidates").hide();
    $("#deadline").hide();
    $("#winner").hide();
    $("#regCandidate").show();
  }
  const showCand = () => {
    $("#updCandidate").hide();
    $("#regCandidate").hide();
    $("#deadline").hide();
    $("#winner").hide();
    $("#candidates").show();
  }
  const showSetDead = () => {
    $("#updCandidate").hide();
    $("#candidates").hide();
    $("#regCandidate").hide();
    $("#winner").hide();
    $("#deadline").show();
  }
  const showViewWin = () => {
    $("#updCandidate").hide();
    $("#candidates").hide();
    $("#deadline").hide();
    $("#regCandidate").hide();
    $("#winner").show();
  }


  //handle events
  $("#submitCandidate").click(function() {
    registerCandidate();
  });
 
  //toggle sidebar buttons
  $("#regCand").click(function() {
    document.location.reload();
  })
  $("#upCand").click(function() {
    resetCandidatesCSS();
    showCand();
    resetformValues();
    viewCandidates();
  })
  $("#setDead").click(function() {
    showSetDead();
  })
  $("#viewWin").click(function() {
    showViewWin();
    checkElectionResult();
  })
  $("body").on("load", showRegCand());
})