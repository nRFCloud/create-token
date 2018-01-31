/* global describe it expect */

const {api, schemas} = require('../')

describe('IRIS API', () => {
  it('should export an API definition', () => {
    expect(api).toEqual(
      expect.objectContaining({
        $context: 'https://github.com/NordicSemiconductor/nrfcloud-freyr#irisapiresource',
        $contextVersion: 1
      })
    )
  })
  it('should export schemas', () => {
    expect(schemas).not.toBeUndefined()
    expect(schemas.length).toBeGreaterThanOrEqual(1)
  })
})
