/**
 * Created by bashar on 07/05/15.
 */
var intId;
Session.setDefault("counter", 4);

Template.roomTemplate.onRendered(function () {
    var gameId  = Router.current().params._id;
    //updates user status to ready when counter is 0
    this.autorun(function () {
        if (Session.get("counter") == 0) {
            console.log("stopping interval count down");
            Meteor.clearInterval(intId);
            Meteor.call('setUserReady', gameId, Meteor.user().username);
        }
    });
});

Template.roomTemplate.helpers({
    question : function() {
        return this.problem;
    },
    pending : function(){
        return this.state === 'pending';
    },
    started : function() {
        return this.state === 'started';
    },
    prepare : function(){
        if (this.state === 'prepare') {
            startCounter(this);
            return true;
        };
    },
    result : function( ) {
        return Session.get("result");
    },
    isWrongAnswer : function() {
        return Session.get("result") == "wrong";
    },
    counter : function() {
        return Session.get("counter");
    },
    finished : function() {
        return this.state == 'finished';
    }
});

//what is the scope of this ? global or per room.
var startCounter = function () {
    console.log("room state is prepare");
    //in case we were called multiple times,
    // skip re-registering the interval
    if (intId) {
        return;
    }
    intId = Meteor.setInterval(function() {
        console.log("counting down ..");
        var counter = Session.get("counter");
        Session.set("counter", counter - 1);
    }, 1000);
}

Template.roomTemplate.events({
    'submit .problem-form' : function(evnt){
        evnt.defaultPrevented = true;
        var uAnswer = evnt.target.userAnswer.value;
        if (!uAnswer || uAnswer == '') {
            Session.set('result', 'answer is empty')
        }
        if (uAnswer == this.problem.answer) {
            Session.set('result', 'correct')
            Meteor.call("setGameWinner", this._id, Meteor.user().username);
        } else {
            Session.set('result', 'wrong');
        }
        return false;
    },
    'click .quit' : function(evnt) {
        if (this.state != "finished") {
            Meteor.call("setPlayerQuit", this._id, Meteor.user().username);
        }
        Router.go("lobbyTemplate");
    }
});