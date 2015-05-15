Meteor.methods({
    setUserReady: function (gameId, user) {
        var game = Games.findOne(gameId);
        if (game.user1.name == user) {
            Games.update(gameId, {$set: {'user1.name': user, 'user1.state': 'ready'}});
        } else {
            Games.update(gameId, {$set: {'user2.name': user, 'user2.state': 'ready'}});
        }

        //read game after update
        var game = Games.findOne(gameId);
        if (game.user1.state == 'ready' && game.user2.state == 'ready') {
            Games.update(gameId, {$set: {state: 'started'}});
        }
    },
    setGameWinner: function(gameId, user) {
        var game = Games.findOne(gameId);
        if (!game.winner) {
            Games.update(gameId, {$set: {winner: user, state : 'finished'}});
        }
    },
    setPlayerQuit : function(gameId, user) {
        var game = Games.findOne(gameId);

        if (game.state !='started') {
            Games.update(gameId, {$set: {state : 'terminated'}});
        }

        if (game.user1.name == user) {
            Games.update(gameId, {$set: {state : 'terminated', winner : game.user2.name}});
        } else {
            Games.update(gameId, {$set: {state : 'terminated', winner : game.user1.name}});
        }
    },
    initGame: function(name, userName) {
        var problemCount = Problems.find({}).count();
        var randomPosition = Math.floor(Math.random() * (problemCount - 1)) + 1;
        var problem = Problems.findOne({number : {$eq : randomPosition}});
        var id = Games.insert({
            name : name,
            problem: problem,
            user1 : {name : userName, state : 'waiting'},
            state : 'pending'
        });
        return id;
    }
});


Meteor.startup(function(){
    var count = Problems.find().count();
    if(count == 0) {
        var probs = [
            {
                number : 1,
                num1: 10,
                num2: 20,
                answer: 30
            },
            {
                number : 2,
                num1: 13,
                num2: 25,
                answer: 38
            },
            {
                number : 3,
                num1: 39,
                num2: 24,
                answer: 63
            },
            {
                number : 4,
                num1: 37,
                num2: 63,
                answer: 100
            },
            {
                number : 5,
                num1: 234,
                num2: 503,
                answer: 737
            },
            {
                number : 6,
                num1: 752,
                num2: 445,
                answer: 1197
            },
            {
                number : 7,
                num1: 39,
                num2: 24,
                answer: 63
            }
        ];

        probs.forEach(function(prob) {
            Problems.insert(prob);
        });
    }


});