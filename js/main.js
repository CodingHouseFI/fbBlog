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
    var blog = $("#blog");
    blog.find("form").submit(function() {
      var postText = blog.find("textarea").val();
      CHBlog.postsRef.push({
        authorName: CHBlog.currentUser.displayName,
        text: postText,
        postTime: Firebase.ServerValue.TIMESTAMP
      });
      return false;
    });

    var templatePost = $("#posts .post:last"), currentPost;
    CHBlog.postsRef.on("child_added", function(snap) {
      var fbPost = snap.val();
      currentPost = templatePost.clone().removeClass("hidden");
      currentPost.find(".author-name").text(fbPost.authorName);
      currentPost.find(".timestamp").text((new Date(fbPost.postTime)).toLocaleString());
      currentPost.find(".text").text(fbPost.text);
      $("#posts").prepend(currentPost);
    });
  }
}

CHBlog.postsRef = CHBlog.db.child("posts");

$(document).ready(CHBlog.init);
