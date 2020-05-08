import { loadSample } from '@libp2p/observer-testing'

describe('binary deserialization', () => {
  it('deserializes binary protobuf file', () => {
    const {
      data: { states },
    } = loadSample()

    expect(states, 'Sample data should deserialize to an array').toBeInstanceOf(
      Array
    )

    expect(
      states.length > 0,
      'Deserialized sample data array is not empty'
    ).toBeTruthy()
  })
})
