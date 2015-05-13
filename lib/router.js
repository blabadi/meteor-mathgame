/**
 * Created by bashar on 09/05/15.
 */
Router.configure({
    layoutTemplate : 'appBody'
});

Router.map(function() {
    this.route('lobbyTemplate', {
        path : '/lobby',
        data: function() {
         return Games.find({});
        },
        action: function () {
            this.render();
        }
    });

    this.route('roomTemplate', {
        path: '/games/:_id',
        data: function () {
            return Games.findOne(this.params._id);
        },
        action: function () {
            this.render();
        }
    });
});