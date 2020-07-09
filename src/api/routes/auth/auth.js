/**
 * Exposes auth related routes
 *
 * @author: adis0892 on 07/07/20
 * */
import {Router} from 'express';
import * as HttpStatus from "http-status-codes";
import jwkToPem from 'jwk-to-pem';
import * as jwt from "jsonwebtoken";
import request from 'request';

export default () => {
    const AuthRouter = new Router({mergeParams: true});

    AuthRouter.get('/authenticate', async (req, res) => {
        let token = 'eyJraWQiOiJzYzVyUWJiMiszZnM3cmI5ODNBY0ZLZVhLNVJFdXgrMlpraUhlejE2ZlU0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3YzA2N2RkNy04ZWExLTQ1NGMtOTJiMC03Mjc2MGM3NGJhOTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfSTVkdE5FOWQxX0F6dXJlQUQiXSwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE1OTQwNzYxMjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0k1ZHRORTlkMSIsImV4cCI6MTU5NDMyMzE3OSwiaWF0IjoxNTk0MzE5NTc5LCJ2ZXJzaW9uIjoyLCJqdGkiOiI3ZDg2NTExYy1mOWZiLTRiMGEtYWY2Zi1jMjkyODRmMzAyMDIiLCJjbGllbnRfaWQiOiIydDE2b3FxZWEzZHM1YzJvcnAzcnBxbWU1YiIsInVzZXJuYW1lIjoiYXp1cmVhZF9hZGlzMDg5MiJ9.GxOPogcpoNIfSmjb5woGuMObGIrfLJCjwFKOGHVMMfCCkhoPvxSwleUSc6hF7YLhCOOB9x7I89XK2iR7sFnSlRJ5h79fIFgHoUN7sbfvduME29a5X8qoiGLs5EkcA_39jOG4bg-Zsggor1ZuJtOBNl_YKMJMHEXtGYuFLKZbR4JPv9-_GAatxuc4Yj0NnL8PN5Wz67-5oKikBcGPAmRqH8KTydFKBI3WwUkhO0aa8z3-zNl3LfNXnJnugAeMPIRmFn4iCI3HzVbcyH6dvzouL-zX4CQAR5kfRbOXjzeZT7B7qNueafzqMgtTnacbczHTq69OuU3d48tb75r3rMW0GA'
        // ValidateToken(token)
        differentValidation(token)
        res.status(HttpStatus.OK).json('');
    });

    return AuthRouter;
};

function ValidateToken(token) {

        const decodedFromJwt = jwt.decode(token, {complete: true});

        console.log('from jwt decode', decodedFromJwt)


    //
        let exp = decodedFromJwt.header.exp;
        let now = Date.now();

        console.log("exp", exp)
        console.log('now', now)

        var difference = exp - now;

        var sec = new Date(difference * 1000)

        console.log("dif sec", difference);

       //

        const matchingKid = decodedFromJwt.header.kid;

        console.log('matchingKid', matchingKid)

        const url = 'https://public-keys.auth.elb.us-east-1.amazonaws.com/' + matchingKid


        request({
                url: url,
                json: true
            }, function (error, response, body) {
                // console.log('body', body)
                let pub_key = body
                console.log('pubkey', pub_key)
                jwt.verify(token, pub_key, {algorithms: ["RS256"]}, (error, decode) => {
                    console.log("decoded", decode)
                    console.log('error', error)
                })

            }
        )

}

function differentValidation(token) {
    var pems;

    if (!pems) {
        //Download the JWKs and save it as PEM
        request({
            url: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_I5dtNE9d1/.well-known/jwks.json',
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    console.log('kid from endpoint',i, keys[i].kid)
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }

                ValidateToken2(pems, token);

            } else {
                //Unable to download JWKs, fail the call
                console.log("eerrr")
            }
        });
    } else {
        //PEMs are already downloaded, continue with validating the token
        ValidateToken(pems);
    }
}

function ValidateToken2(pems, token) {

    //Fail if the token is not jwt
    var decodedJwt = jwt.decode(token, {complete: true});
    if (!decodedJwt) {
        console.log("Not a valid JWT token");
        return;
    }

    //Fail if token is not from your User Pool
    // if (decodedJwt.payload.iss != iss) {
    //     console.log("invalid issuer");
    //     context.fail("Unauthorized");
    //     return;
    // }
    //
    // //Reject the jwt if it's not an 'Access Token'
    // if (decodedJwt.payload.token_use != 'access') {
    //     console.log("Not an access token");
    //     context.fail("Unauthorized");
    //     return;
    // }

    //Get the kid from the token and retrieve corresponding PEM
    var kid = decodedJwt.header.kid;
    console.log('decoded 2', decodedJwt)
    var pem = pems[kid];
    if (!pem) {
        console.log('Invalid access token');
        return;
    }

    //Verify the signature of the JWT token to ensure it's really coming from your User Pool

    jwt.verify(token, pem,  {algorithms: ["RS256"]},function(err, payload) {
        if(err) {
            console.log('verify error', err)
        } else {
            //Valid token. Generate the API Gateway policy for the user
            //Always generate the policy on value of 'sub' claim and not for 'username' because username is reassignable
            //sub is UUID for a user which is never reassigned to another user.

            var principalId = payload.sub;

            // //Get AWS AccountId and API Options
            // var apiOptions = {};
            // var tmp = event.methodArn.split(':');
            // var apiGatewayArnTmp = tmp[5].split('/');
            // var awsAccountId = tmp[4];
            // apiOptions.region = tmp[3];
            // apiOptions.restApiId = apiGatewayArnTmp[0];
            // apiOptions.stage = apiGatewayArnTmp[1];
            // var method = apiGatewayArnTmp[2];
            // var resource = '/'; // root resource
            // if (apiGatewayArnTmp[3]) {
            //     resource += apiGatewayArnTmp[3];
            // }
            //
            // //For more information on specifics of generating policy, see the blueprint for the API Gateway custom
            // //authorizer in the Lambda console
            //
            // var policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
            // policy.allowAllMethods();
            //
            // context.succeed(policy.build());
        }
    });
}


