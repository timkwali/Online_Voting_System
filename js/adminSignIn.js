  $("button").click(function() {
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/administrators",
      success: function(admins) {
        const adm = $("#adminNumber").val();
        const pass = $("#password").val();
        signIn(admins, adm, pass);
      },
      error: function() {
        alert("Something went wrong");
      }
    })
  })

  const signIn = (admins, adm, pass) => {
    //compare admin info
    admins.forEach(admin => {
      const adminNum = admin["adminNumber"] === adm;
      const paswrd = admin["password"] ===  pass;
      if(adminNum) {
        if(paswrd) {
          sendAdminData(admin);
        } else {
          alert(`admin number or password not correct`)
        }
      }
    });
  }

  const sendAdminData = (admin) => {
    //send current admin to temp2
    $.ajax({
      type: "PUT",
      url: "http://localhost:3000/temp2/1",
      data: admin,
      success: function() {
        console.log("successfully sent admin data to temp2")
        window.location.href = "adminPage.html"
      }, 
      error: function() {
        alert("error sending admin data to temp2")
      },
    }) 
  }
$(document).ready(function() {
  $("body").on("load", showElectionDeadline() );
})