export default interface Message {
  action: string
  payload: {
    [key: string]: any
  }
}
