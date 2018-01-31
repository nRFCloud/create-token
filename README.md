# Create Token Endpoint

[![npm version](https://img.shields.io/npm/v/@nrfcloud/create-token.svg)](https://www.npmjs.com/package/@nrfcloud/create-token)
[![Build Status](https://travis-ci.org/nRFCloud/create-token.svg?branch=master)](https://travis-ci.org/nRFCloud/create-token)
[![Test Coverage](https://api.codeclimate.com/v1/badges/31e9be8707b0aeede72f/test_coverage)](https://codeclimate.com/github/nRFCloud/create-token/test_coverage)  
[![Greenkeeper badge](https://badges.greenkeeper.io/nrfcloud/create-token.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)  
[![DeepScan Grade](https://deepscan.io/api/projects/1790/branches/7755/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1790&bid=7755)
[![Known Vulnerabilities](https://snyk.io/test/github/nrfcloud/create-token/badge.svg?targetFile=package.json)](https://snyk.io/test/github/nrfcloud/create-token?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/31e9be8707b0aeede72f/maintainability)](https://codeclimate.com/github/nRFCloud/create-token/maintainability)

API endpoint which creates an identity token to be used for authenticating the user against the API.

> :warning: This endpoint should only be used for testing environments

## Tests

The tests are integration tests and use CloudFormation to set up
the required resources. See 

Set these environment variables:

    AWS_ACCESS_KEY_ID=...
    AWS_SECRET_ACCESS_KEY=...

Make sure that this user has the necessary permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "cloudformation:*",
            "Resource": "arn:aws:cloudformation:*:*:stack/test-*"
        },
        {
            "Effect": "Allow",
            "Action": "cognito-idp:*",
            "Resource": "*"
        }
    ]
}
```
