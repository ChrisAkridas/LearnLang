export interface ResponseFuncs {
  GET?: Function,
  POST?: Function,
  PUT?: Function,
  PATCH?: Function,
  DELETE?: Function
}

export interface Todo {
  _id?: number,
  item: string,
  completed: boolean
}