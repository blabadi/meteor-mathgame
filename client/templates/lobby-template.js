/**
 * Created by bashar on 09/05/15.
 */
Template.lobbyTemplate.helpers({
    games : function() {
        return Games.find();
    }
});

Template.game.helpers({
    openRoom : function () {
        return this.state == 'pending';
    },
    notCreator : function() {
      return (Meteor.user() && this.user1.name != Meteor.user().username);
    },
    displayName : function(name) {
        if (Meteor.user() && Meteor.user().username == name) {
            return "You";
        }
        return name;
    }
});

Template.lobbyTemplate.events({
    'submit .new-game' : function(evnt) {
        evnt.defaultPrevented = true;
        evnt.preventDefault();
        var name = evnt.target.gameName.value;

        if (!name || name.trim() == "") {
            return;
        }

        Meteor.call('initGame', name, Meteor.user().username, function(err, data) {
            Router.go("roomTemplate", {_id : data});
        });

        evnt.preventDefault();
        return false;
    }
});

Template.game.events({
    'click .btn-join' : function(evnt) {
        console.log("join clicked..", this._id);
        Games.update(this._id, {$set: {state : 'prepare',
            user2 : {name : Meteor.user().username, state:'waiting'}}});
        Router.go("roomTemplate", {_id : this._id});
        return false;
    }
});