/* Create a Project */

Template.createProject.helpers({

});

Template.createProject.onCreated(function () {

});

Template.createProject.events({
  'submit .createProject': function (event, template) {
    event.preventDefault();

    var name = event.target.name.value;
    var description = event.target.description.value;

    var project = {
      'name': name,
      'description': description
    }

    Meteor.call('createProject', project, function (error, response) {
      if (error) throw error;
      Router.go('member.show', {_id: Meteor.userId()});
    });
    return false;
  }
});

/* List user Projects */

Template.userProjects.helpers({
  'projects': function () {
    var controller = Router.current();
    return Projects.find({ownerId: controller.params._id});
  },
  isMe: function () {
    return this._id === Meteor.userId();
  }
});

Template.projectBox.helpers({
  'joined': function () {
    return this.collaborators.indexOf(Meteor.userId()) > -1;
  },
  'collaboratorsCount': function () {
    return this.collaborators.length;
  },
  isMe: function () {
    var controller = Router.current();
    return controller.params._id === Meteor.userId();
  }
});

Template.userProjects.onCreated(function () {
  var self = this;
  var controller = Router.current();
  self.autorun(function () {
    self.subscribe('userProjects', controller.params._id);
  });
});

Template.projectBox.events({
  'click .joinProject': function () {
    Meteor.call('joinProject', this._id,
      function (error, response) {
        if (error) throw error;
      }
    );
  },

  'click .leaveProject': function () {
    Meteor.call('leaveProject', this._id,
      function (error, response) {
        if (error) throw error;
      }
    );
  }
});

/* Show user projects */

Template.showProject.helpers({
  'project': function () {
    var controller = Router.current();
    return Projects.findOne({_id: controller.params._id});
  },

  'collaborator': function () {
    return Meteor.users.findOne({_id: this.valueOf()});
  }
});

Template.showProject.events({

});

Template.showProject.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('project', controller.params._id);
  });
});

/* Edit a project */

Template.editProject.helpers({
  'project': function () {
    var controller = Router.current();
    return Projects.findOne({_id: controller.params._id});
  }
});

Template.editProject.events({
  'submit .editProject': function (event, template) {
    event.preventDefault();

    var name = event.target.name.value;
    var description = event.target.description.value;

    var project = {
      'name': name,
      'description': description
    }

    Meteor.call('editProject', this._id, project, function (error, response) {
      if (error) throw error;
      Router.go('member.show', {_id: Meteor.userId()});
    });
    return false;
  },

  'click .editProject': function (event, template) {
    event.preventDefault();
    let controller = Router.current();
    swal({ title: 'Are you sure?', text: 'You will not be able to recover this project!', type: 'warning', showCancelButton: true, confirmButtonColor: '#DD6B55', confirmButtonText: 'Yes, remove it!', closeOnConfirm: false }, function () {
      Meteor.call('removeProject', controller.params._id, function (error, response) {
        if (error) throw error;
        Router.go('members');
        swal('Remove!', 'The project has been removed.', 'success');
      });
    });
  }
});

Template.editProject.onCreated(function () {
  var self = this;
  self.autorun(function () {
    var controller = Router.current();
    self.subscribe('project', controller.params._id);
  });
});

/* Show all projects */

Template.allProjects.helpers({
  'projects': function () {
    return Projects.find();
  }
});

Template.allProjects.events({

});

Template.allProjects.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe('allProjects');
  });
});

