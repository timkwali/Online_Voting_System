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
        },
        error: function() {
          alert("error updating database")
        }
      })
      clearInterval(checkDeadline)
    } 
  }, 1000)
}