// Create the Ember.js application
window.App = Ember.Application.create();


// Models
App.Contribution = Ember.Object.extend({
  project_name: '',
  project_url : ''
});


// Controllers
App.contributionController = Ember.ArrayController.create({
  content: [],
  message: null,
  forks: null,

  forksChanged: function() {
    if(this.get("forks") == 0) {
      if(this.get("content").length == 0)
        this.set("message","Couldn't find any contributions...");
      else
        this.set("message","Done");
    }
  }.observes("forks"),

  createContribution: function(project_data) {
    this.clearMessages();
    var contribution = App.Contribution.create(project_data);
    this.pushObject(contribution);
  },

  clearContributions: function() {
    this.set("content", []);
  },

  clearMessages: function() {
    this.set("message", null);
  },

  // Searches the username in the list of contributors of a given cloned project
  // If the username is found, a new contributor object is created.
  fetchContributions: function(username, clone_uri, project_data) {
    var self = this;
    $.ajax({
      url: "https://api.github.com/repos/" + clone_uri + "/contributors",
      success: function(data) {
        data.forEach(function(contributor, index, array) {
          if(contributor.login == username)
            App.contributionController.createContribution(project_data);
          if(index == (array.length-1)) {
            var old_forks = self.get('forks');
            self.set("forks",old_forks-1);
          }
        });
      },
      dataType: "json"
    });
  },

  // Given a username and a repo, fetch the clone repo and proceeds with checking the
  // contributors' list
  fetchCloneRepo: function(username, repo) {
    var self = this;
    $.ajax({
      url: "https://api.github.com/repos/" + repo.full_name,
      success: function(data) {
        var clone_uri = data.parent.full_name;
        self.fetchContributions(username, clone_uri, {project_name: data.parent.full_name, project_url: data.parent.html_url});
      },
      dataType: "json"
    });
  },

  // Fetch the user repos and for each fork, proceed with the searching for contributions
  fetchUserContributions: function(username) {
    var self = this;
    $.ajax({
      url: "https://api.github.com/users/" + username + "/repos",
      success: function(data) {
        var forks = data.filter(function(repo) { return (repo.fork == true);});
        if(forks.length) {
          self.set("forks", forks.length);
          forks.forEach(function(repo) {
            self.fetchCloneRepo(username, repo);
          });
        }
        else
          self.set("message","The user " + username + " didn't fork a repo yet!");
      },
      error: function(e) {
        if(e.status == 404)
          self.set("message","Oops... It appears that the user '" + username + "' doesn't exist...");
        else
          self.set("message","Oops... something went wrong, plesse try again!");
      },
      dataType: "json"
    });
  }

});


// Views

// View responsible for the text field and handling the value
App.SearchUserView = Ember.TextField.extend({
  insertNewline: function() {
    App.contributionController.clearContributions();
    App.contributionController.set("message","searching");
    var value = this.get('value');
    if (value) {
      App.contributionController.fetchUserContributions(value);
      this.set('value', '');
    }
  }
});

// Display messages based on the controller's message property
App.messageView = Ember.View.extend({
  messageBinding: "App.contributionController.message",
  template: Ember.Handlebars.compile("{{message}}")
});

// Display the contribution links based on the array of
// contributions from the controller
App.contributionView = Ember.View.extend({
  urlBinding: "content.project_url",
  template: Ember.Handlebars.compile('<a target="blank" {{ bindAttr href="url" }}>{{content.project_name}}</a>')
});

// Handle the list of contributions
App.contributionsView = Ember.CollectionView.extend({
  content: App.contributionController,
  tagName: "ul",
  emptyView: App.SearchingView,
  itemViewClass: App.contributionView
});
