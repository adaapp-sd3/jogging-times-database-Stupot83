let request = require('request');
let cookie = request.cookie("userId=5c4b339724abd4a5f22ab236");

describe("Given a new time is entered", () => {

let serverResponse;

    beforeEach((done) => {

        let requestOptions = () =>{
            return {
            method: 'POST',
            url: "http://localhost:3000/times/new",
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': cookie 
            },
            form: {
               date: "2019-01-11T11:11",
               distance: "2",
               duration: "1"
            }
        };
        };

        request(requestOptions(), (error, response, body) => {
            if(error) throw new Error(error);
            serverResponse  = response;
            done();
        });
    });

    it("the time is created successfully", () => {
        expect(serverResponse.statusCode).toEqual(302);
    });

    describe("and the times are listed", () => {

        beforeEach((done) => {

            let requestOptions = () =>{
                return {
                method: 'GET',
                url: "http://localhost:3000/times",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': cookie 
                },
            };
            };
            request(requestOptions(), (error, response, body) => {
                if(error) throw new Error(error);
                serverResponse  = response;
                done();
            });
        });

        it("then the times are retrieved", () => {
            expect(serverResponse.statusCode).toEqual(200);
            console.log(serverResponse.times);
        });
        });
    });
