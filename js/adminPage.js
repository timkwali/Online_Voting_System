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
            //show about candidate info
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
        if( confirm(`ARE YOU SURE YOU WANT TO DELETE ${candidate["firstName"]} ${candidate["lastName"]}?`) ) {
          $.ajax({
            type: "DELETE",
            url: `http://localhost:3000/candidates/${candidate["id"]}`,
            success: function(data) {
              alert(`YOU DELETED ${candidate["firstName"]} ${candidate["lastName"]}!`)
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
      
    })
  }

  //show/hide different windows
  const showRegCand = () => {
    $("#candidates").hide();
    $("#deadline").hide();
    $("#winner").hide();
    $(".signIn").show();
  }
  const showCand = () => {
    $(".signIn").hide();
    $("#deadline").hide();
    $("#winner").hide();
    $("#candidates").show();
  }
  const showSetDead = () => {
    $("#candidates").hide();
    $(".signIn").hide();
    $("#winner").hide();
    $("#deadline").show();
  }
  const showViewWin = () => {
    $("#candidates").hide();
    $("#deadline").hide();
    $(".signIn").hide();
    $("#winner").show();
  }

  //handle events
  $("#submitCandidate").click(function() {
    registerCandidate();
  });
  $(".update").click(function() {
    $("#candidates").hide();
    $("#updateCandidate").show();
  })
 
  //toggle sidebar buttons
  $("#regCand").click(function() {
    showRegCand();
  })
  $("#upCand").click(function() {
    $("#candPic").css("background-image", "none");
    $("#partyPic").css("background-image", "none");
    $("#updDel").text("");
    $("#bottom").text("").css("border-top", "none")
    $(".names").text("")
    showCand();
    viewCandidates();
  })
  $("#setDead").click(function() {
    showSetDead();
  })
  $("#viewWin").click(function() {
    showViewWin();
  })
  $("body").on("load", showRegCand());
})