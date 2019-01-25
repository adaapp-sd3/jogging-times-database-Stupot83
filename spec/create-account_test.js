let request = require('request');

describe("Given the user creates a new account", () => {

let serverResponse;

    beforeAll((done) => {
        let requestOptions = () =>{
            return {
            method: 'POST',
            url: "http://localhost:3000/create-account",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                name: "test-user",
                email: "test@test.com",
                password: "password",
                passwordConfirm: "password"
            }
        };
        };
        request(requestOptions(), (error, response, body) => {
            if(error) throw new Error(error);
            serverResponse  = response;
            done();
        });
    });

    it("the user is created successfully", () => {
        expect(serverResponse.statusCode).toEqual(302);
    });

    describe("and I retrieve the user by email", () => {

        let retrievedUser;

        beforeEach((done) => {

            let requestOptions = () => {
                return {
                method: 'GET',
                url: "http://localhost:3000/user",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                form: {
                    email: "test@test.com"
                }
            };
            };
            request(requestOptions(), (error, response, body) => {
                if(error) throw new Error(error);
                serverResponse  = response;
                retrievedUser = JSON.parse(body);
                done();
            });
        });

        it("then the user details are retrieved", () => {
            expect(serverResponse.statusCode).toEqual(200);
            expect(retrievedUser.email).toEqual("test@test.com");
        });

        describe("and the user deletes their account", () => {

            beforeEach((done) => {
    
                let requestOptions = () =>{
                    return {
                    method: 'GET',
                    url: "http://localhost:3000/delete-account",
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': request.cookie(`userId=${retrievedUser._id}`)
                    },
                };
                };
                request(requestOptions(), (error, response, body) => {
                    if(error) throw new Error(error);
                    serverResponse  = response;
                    done();
                });
            });
    
            it("then the user account is deleted", () => {
                expect(serverResponse.statusCode).toEqual(200);
            });
            });
    });
    });
