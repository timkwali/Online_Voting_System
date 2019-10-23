let voters;
const getVoters = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/voters",
    success: function(people) {
      voters = people;
    },
    error: function() {
      alert("Something went wrong")
    }
  })
}

const sendVoter = (voter) => {
  voter["identity"] = voter["id"]
  //send current voter to temp
  $.ajax({
    type: "PUT",
    url: "http://localhost:3000/temp/1",
    data: voter,
    success: function() {
      window.location.href = "voterHomepage.html"
    }, 
    error: function() {
      alert("Something went wrong")
    }
  })
  
}

$("button").click(function() {
  event.preventDefault();
  voters.forEach(voter => {
    const regNum = $("#registrationNumber").val() === voter["registrationNumber"];
    const pword = $("#password").val() === voter["password"];
    if(regNum) {
      if(pword) {
        sendVoter(voter)
      } else {
      alert("registration number or password not correct")
      }
    }
  })
})

$("body").on("load", getVoters());