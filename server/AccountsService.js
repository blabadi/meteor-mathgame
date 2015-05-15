/**
 * Created by bashar on 5/15/2015.
 */
Meteor.methods({
    'createPlayer' : function (user) {
        var id = Accounts.createUser({
            username : user.username,
            password : user.password
        });

        Roles.addUsersToRoles(id, ['player']);
        return user;
    }
});