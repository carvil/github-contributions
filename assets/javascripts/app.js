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
  error: null,

  createContribution: function(project_data) {
    var contribution = App.Contribution.create(project_data);
    this.pushObject(contribution);
  },

  clearContributions: function() {
    this.set("content", []);
  },

  fetchContributions: function(username, clone_uri, project_data) {
    var self = this;
    $.ajax({
      url: "https://api.github.com/repos/" + clone_uri + "/contributors",
      success: function(data) {
        data.forEach(function(contributor) {
          if(contributor.login == username)
            App.contributionController.createContribution(project_data);
        });
      },
      dataType: "json"
    });
  },

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

  fetchUserContributions: function(username) {
    var self = this;
    $.ajax({
      url: "https://api.github.com/users/" + username + "/repos",
      success: function(data) {
        data.forEach(function(repo) {
          if(repo.fork)
            self.fetchCloneRepo(username, repo);
        });
      },
      error: function(e) {
        if(e.status == 404)
          App.contributionController.set("error","Oops... It appears that the user '" + username + "' doesn't exist...");
        else
          App.contributionController.set("error","Oops... something went wrong, plesse try again!");
      },
      dataType: "json"
    });
  }

});


// Views
App.SearchUserView = Ember.TextField.extend({
  insertNewline: function() {
    App.contributionController.set("error",null);
    var value = this.get('value');
    if (value) {
      App.contributionController.fetchUserContributions(value);
      this.set('value', '');
    }
  }
});

App.errorView = Ember.View.extend({
  errorBinding: "App.contributionController.error",
  template: Ember.Handlebars.compile("{{error}}")
});

App.SearchingView = Ember.View.extend({
  template: Ember.Handlebars.compile("<p>no contributions yet</p>")
});

App.contributionView = Ember.View.extend({
  urlBinding: "content.project_url",
  template: Ember.Handlebars.compile('<a target="blank" {{ bindAttr href="url" }}>{{content.project_name}}</a>')
});

App.contributionsView = Ember.CollectionView.extend({
  content: App.contributionController,
  tagName: "ul",
  emptyView: App.SearchingView,
  itemViewClass: App.contributionView
});
