export type Newable<T> = abstract new () => T
export type ClassDefinitionFor<T> = { prototype: T }

export type ExcludeMethods<TClass> = Pick<
  TClass,
  {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof TClass]: TClass[K] extends Function ? never : K
  }[keyof TClass]
>

type BuilderProperties<T, P extends string> = {
  [K in keyof ExcludeMethods<T> as K extends string
    ? `${P}${Capitalize<K>}`
    : never]: (value: T[K]) => BuilderProperties<T, P> & { build(): T }
}

export type Builder<TEntity> = BuilderProperties<TEntity, "set"> & {
  build(): TEntity
}
