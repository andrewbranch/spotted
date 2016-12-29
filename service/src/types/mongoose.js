/* @flow */

type ManyQuery<T, PopulatedT> = {
  populate(path: Object | string, select?: Object | string, model?: ModelConstructor<any>, match?: Object, options?: Object): ManyQuery<PopulatedT, PopulatedT>;
  exec(operation?: string | Function, callback?: Function): Promise<Model<T>[]>;
};

type OneQuery<T, PopulatedT> = {
  populate(path: Object | string, select?: Object | string, model?: ModelConstructor<any>, match?: Object, options?: Object): OneQuery<PopulatedT, PopulatedT>;
  exec(operation?: string | Function, callback?: Function): Promise<Model<T>>;
};

export type BaseModel<T> = {
  save(options?: Object, callback?: Function): Promise<Model<T>>;
}

export type ModelConstructor<T, PopulatedT> = {
  find(properties?: Object): ManyQuery<T, PopulatedT>;
}

export type Model<T> = BaseModel<T> & T; 
