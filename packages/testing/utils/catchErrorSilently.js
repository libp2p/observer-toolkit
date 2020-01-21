const consoleError = console.error

function catchErrorSilently(fn) {
  try {
    console.error = () => {}
    fn()
  } catch (error) {
    return error
  } finally {
    console.error = consoleError
  }
}

export default catchErrorSilently
