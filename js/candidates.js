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
         
          //show candidate info
          $("#bottom").css("border-top", "3px solid rgb(21, 214, 0)")
          let p = $("<p/>", {"class": "inf"});
          $("#bottom").text("")
          $("#bottom").append(p.text(`NAME: ${candidate["firstName"]} ${candidate["lastName"]}`).clone())
          $("#bottom").append(p.text(`PARTY: ${candidate["party"]}`).clone());
          $("#bottom").append(p.text(`AGE: ${candidate["age"]}`).clone());
          $("#bottom").append(p.text(`GENDER: ${candidate["gender"]}`).clone());
        }
      })
    })
  })
}

$("body").on("load", viewCandidates());
$(document).ready(function() {
  $("body").on("load", showElectionDeadline());
})
