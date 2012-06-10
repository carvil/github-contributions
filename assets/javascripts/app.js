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

  createContribution: function(project_name, project_url) {
    var contribution = App.Contribution.create({ project_name: project_name, project_url: project_url });
    this.pushObject(contribution);
  },

  clearContributions: function() {
    this.set("content", []);
  },

  fetchUserContributions: function(username) {
    $.ajax({
      url: "https://api.github.com/users/" + username,
      success: function(data) {
        console.log("success");
        console.log(data);
      },
      error: function(e) {
        console.log("error");
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
    var value = this.get('value');
    if (value) {
      if (App.contributionController.fetchUserContributions(value)) {
        console.log("The use is valid!!");
      }
      else {
        console.log("Invalid user :(");
      }
      App.contributionController.createContribution(value, value);
      this.set('value', '');
    }
  }
});

App.errorView = Ember.View.extend({
  template: Ember.Handlebars.compile("{{error}}")
});

App.SearchingView = Ember.View.extend({
  template: Ember.Handlebars.compile("<p>no contributions yet</p>")
});

App.contributionView = Ember.View.extend({
  template: Ember.Handlebars.compile("{{content.project_name}}")
});

App.contributionsView = Ember.CollectionView.extend({
  content: App.contributionController,
  tagName: "ul",
  emptyView: App.SearchingView,
  itemViewClass: App.contributionView
});
