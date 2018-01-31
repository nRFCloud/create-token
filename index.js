'use strict'

const {CognitoIdentityServiceProvider} = require('aws-sdk')

exports.handler = (event, context, callback) => {
  const {username, password} = JSON.parse(event.body)
  const c = context.cisp || new CognitoIdentityServiceProvider()
  c
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: process.env.client_id,
      UserPoolId: process.env.user_pool,
      AuthParameters: {
        'USERNAME': username,
        'PASSWORD': password
      }
    })
    .promise()
    .then(res => {
      if (!res.AuthenticationResult) {
        throw new Error(JSON.stringify(res))
      }
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({token: res.AuthenticationResult.IdToken})
      })
    })
    .catch(err => {
      console.log(err)
      callback(null, {
        statusCode: 403,
        body: err.message
      })
    })
}

exports.schemas = [
  require('./api/schema/Token')
]

exports.api = require('./api/iris-api')
