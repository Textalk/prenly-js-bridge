# Changelog

## [v2.0.0] - 2025-12-16

### Breaking changes

- Refactored the error handling to reject promises with an instance of a new `RequestError` class (which extends the built-in `Error` class), instead of using plain objects. This change might break code that uses `instanceof Error` in catch blocks, as it could now cause that condition to be triggered for errors that were not previously caught.

### Other changes

- Added new helper method `isRequestError` to the API for identifying `RequestError` instances.

- Corrected the type signatures of API methods to consistently return data instead of potentially returning an error type.
