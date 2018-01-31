'use strict'

/* global expect describe test beforeAll afterAll jest */

jest.setTimeout(1000 * 60 * 5)

const {CloudFormation, CognitoIdentityServiceProvider} = require('aws-sdk')
const {readFile: readFileAsync} = require('fs')
const {promisify} = require('util')
const readFile = promisify(readFileAsync)
const {handler} = require('../')

const region = process.env.AWS_DEFAULT_REGION || 'us-east-1'
const cf = new CloudFormation({region})
const cisp = new CognitoIdentityServiceProvider({region})

const createStack = async () => {
  const template = await readFile('./__test__/cloudformation.yml', 'utf-8')
  return cf
    .createStack({
      ClientRequestToken: 'test-create-token-create',
      StackName: 'test-create-token',
      EnableTerminationProtection: false,
      OnFailure: 'DELETE',
      TemplateBody: template
    })
    .promise()
    .then(({StackId}) => cf.waitFor('stackCreateComplete', {StackName: StackId}).promise())
    .then(({Stacks}) => Stacks.pop())
}

const deleteStack = async StackId => cf
  .deleteStack({
    StackName: StackId,
    ClientRequestToken: 'test-create-token-delete'
  })
  .promise()

describe('createToken', () => {
  let TestStackId
  let clientId
  let userPoolId
  const username = 'alex@example.com'
  const password = 'Changeme42!'

  beforeAll(() => createStack()
    .then(({StackId, Outputs}) => {
      TestStackId = StackId
      const o = Outputs.reduce((outputs, {OutputKey, OutputValue}) => {
        outputs[OutputKey] = OutputValue
        return outputs
      }, {})

      clientId = o.UserPoolClientId
      userPoolId = o.UserPoolId

      process.env.client_id = clientId
      process.env.user_pool = userPoolId

      return cisp
        .adminCreateUser({
          UserPoolId: userPoolId,
          Username: username,
          MessageAction: 'SUPPRESS',
          TemporaryPassword: password,
          UserAttributes: [
            {
              Name: 'email',
              Value: username
            },
            {
              Name: 'email_verified',
              Value: 'True'
            }
          ]
        })
        .promise()
        .then(user => cisp
          .adminInitiateAuth({
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            ClientId: o.UserPoolClientId,
            UserPoolId: o.UserPoolId,
            AuthParameters: {
              'USERNAME': username,
              'PASSWORD': password
            }
          })
          .promise()
          .then(({Session}) => cisp.respondToAuthChallenge({
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ClientId: o.UserPoolClientId,
            ChallengeResponses: {
              'USERNAME': username,
              'NEW_PASSWORD': password
            },
            Session
          }).promise()))
    })
  )

  afterAll(() => deleteStack(TestStackId))

  test('create token', done => {
    handler({body: JSON.stringify({username, password})}, {cisp}, (err, res) => {
      if (err) {
        console.error(err)
      }
      expect(res).toHaveProperty('statusCode')
      expect(res).toHaveProperty('body')
      expect(res.statusCode).toEqual(201)
      const body = JSON.parse(res.body)
      expect(body).toHaveProperty('token')
      const payload = JSON.parse(Buffer.from(body.token.split('.')[1], 'base64'))
      expect(payload).toEqual(
        expect.objectContaining({
          aud: clientId,
          token_use: 'id',
          iss: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
          'cognito:username': username,
          email: username
        })
      )
      done()
    })
  })
})
