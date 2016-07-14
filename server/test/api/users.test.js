var expect = require('chai').expect;
var request = require('request');

var users = require('./users.js');
var href = require('./href.js');

describe('users API test:', function() {

    var url = 'http://localhost:3000/users';

    function getUserList(callback) {
        request.get(url, function(err, response, body) {
            expect(err).to.be.null;
            expect(response.statusCode).to.be.equal(200);
            var users = JSON.parse(body);
            expect(users).to.be.an('array');
            expect(users).to.be.not.empty;
            callback(users);
        });
    }

    function getUser(id, callback) {
        request.get(url + '/' + id, function(err, response, body) {
            expect(err).to.be.null;
            expect(respone.statusCode).to.be.equal(200);
            var user = body;
            expect(user).to.be.not.null;
            callback(user);
        });
    }

    function expectUser(user) {
        expect(user).not.to.have.a.property('_id');
        expect(user).to.have.a.property('id');
        expect(user).to.have.a.property('name');
        expect(user).to.have.a.property('level');
        expect(user).to.have.a.property('region');
        expect(user).to.have.a.property('description');
        expect(user).to.have.a.property('phone');
    }

    it('GET /users', function(done) {
        getUserList(function(users) {
            for (var user of users) {
                expectUser(user);
            }
            getUserList(function(users2) {
                expect(users).to.be.deep.equal(users2);
                done();
            });
        });
    });

    it('GET /users/_userid_', function(done) {
        getUserList(function(users) {
            for (var user of users) {
                var id = user.id;
                getUser(id, function(user2) {
                    expectUser(user2);
                    expect(user).to.be.deep.equal(user2);
                });
            }
            done();
        });
    });
    
});
