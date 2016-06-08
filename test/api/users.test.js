var expect = require('chai').expect;
var users = require('./users.js');

describe('API test: /users', function() {
    it('GET /users should return users list', function(done) {
        users.getUserList(function(result) {
            expect(result).to.be.an('array');
            expect(result).to.be.not.empty;
            done();
        });
    });
});
