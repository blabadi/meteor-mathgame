/**
 * Created by bashar on 09/05/15.
 */
Template.appBody.helpers({

});

Template.appBody.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});