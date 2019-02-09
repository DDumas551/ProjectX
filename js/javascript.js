var config = {
    apiKey: "AIzaSyAn89K__0p3g-lv4-9bQdsYiCTecqVh62Q",
    authDomain: "projectx-2dc3f.firebaseapp.com",
    databaseURL: "https://projectx-2dc3f.firebaseio.com",
    projectId: "projectx-2dc3f",
    storageBucket: "projectx-2dc3f.appspot.com",
    messagingSenderId: "33610232091"
  };
  firebase.initializeApp(config);
  let database = firebase.database();

function addSlick() {
    $('.single-item').slick({
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear"
    });

}

$(document).on("click", "#commentSubmit", function() {
    console.log("clicked");
    database.ref().push({
        name: $("#userName").val().trim(),
        email: $("#userEmail").val().trim(),
        phoneNum: $("#userPhone").val().trim(),
        comment: $("#userComment").val().trim()
    });
});

database.ref().on("child_added", function(childSnapshot) {
    let userName = childSnapshot.val().name;
    let userEmail = childSnapshot.val().email;
    let userPhone = childSnapshot.val().phoneNum;
    let userComment = childSnapshot.val().comment;


    let h5 = $("<div>").text(userName);
    h5.addClass("dyn");
    let para = $("<p>").text(userComment);
    h5.append(para);
    $(".single-item").append(h5);

    $(".dyn").each(function() {
        $('.single-item').slick('slickAdd', $(this))
    })

});


addSlick();



