var CHBlog = {
  db: new Firebase("https://fbblogch.firebaseio.com"),
  init: function() {
    $("#login-btn").click(CHBlog.fbLogin);

    CHBlog.db.onAuth(function(authData) {
      if (authData) {
        CHBlog.currentUser = authData.google;
        CHBlog.render();
        console.log("Authenticated with uid:", authData.uid);
      } else {
        console.log("Client unauthenticated.")
      }
    });
  },
  fbLogin: function() {
    CHBlog.db.authWithOAuthRedirect("google", function(error) {
      if (error) {
        console.log("Login Failed!", error);
      }
    });
    return false;
  },
  render: function() {
    console.log(CHBlog.currentUser);
    $("#user").text(CHBlog.currentUser.displayName);
  }
}

$(document).ready(CHBlog.init);
