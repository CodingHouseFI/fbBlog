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

    var $currentPost = $("#current-post");
    $("#posts").on("click", ".more", function() {
      var miniPost = $(this).parents(".post");
      var fullPost = CHBlog.posts[miniPost.data("postId")];
      $currentPost.find(".author-name").text(fullPost.authorName);
      $currentPost.find(".timestamp").text((new Date(fullPost.postTime)).toLocaleString());
      $currentPost.find(".text").text(fullPost.text);

      $currentPost.removeClass("hidden");
      $("#posts").addClass("hidden");
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
      var fbPost = snap.val(), postId = snap.key();
      CHBlog.posts[postId] = fbPost;
      currentPost = templatePost.clone().removeClass("hidden");
      currentPost.data("postId", postId);
      currentPost.find(".author-name").text(fbPost.authorName);
      currentPost.find(".timestamp").text((new Date(fbPost.postTime)).toLocaleString());
      currentPost.find(".text").text(CHBlog.truncate(fbPost.text));
      $("#posts").prepend(currentPost);
    });
  },

  posts: {},

  truncate: function(text) {
    var length = text.length;
    return length > 140 ? text.substring(0, 140) + "..." : text;
  }
}

CHBlog.postsRef = CHBlog.db.child("posts");

$(document).ready(CHBlog.init);
