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

  createContribution: function(project_name, project_url) {
    var contribution = App.Contribution.create({ project_name: project_name, project_url: project_url });
    this.pushObject(contribution);
  }

});


// Views
App.SearchUserView = Ember.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');
    console.log("Value:");
    console.log(value);
    if (value) {
      App.contributionController.createContribution(value, value);
      this.set('value', '');
    }
  }
});


App.SearchingView = Ember.View.extend({
  template: Ember.Handlebars.compile("<p>searching</p>")
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
