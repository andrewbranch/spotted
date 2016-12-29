/* @flow */

export type Query<T> = {
  exec(operation?: string | Function, callback?: Function): Promise<Model<T>>;
}

export type BaseModel<T> = {
  save(options?: Object, callback?: Function): Promise<Model<T>>;
}

export type ModelConstructor<T> = {
  find(properties?: Object): Query<T>;
}

export type Model<T> = BaseModel<T> & T; 
