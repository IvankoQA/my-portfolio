export class FrameworkError extends Error {
  public readonly code: string

  constructor(message: string, code = "FRAMEWORK_ERROR") {
    super(message)
    this.name = "FrameworkError"
    this.code = code
  }
}
