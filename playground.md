```ts
class Post {
  public id: string
  public title: string
  public comments: string[] = []

  public addComment(comment: string) {
    this.comments.push(comment)
  }
}

class PostBuilder extends Builder(Post) {
  public withComment(comment: string) {
    this.comments = [comment]
  }
}

const b = new PostBuilder()


// type ExcludedMethods = "addComment"
// const b = new PostBuilder<ExcludedMethods>()
// const b = new PostBuilder<{ excludeMethods: true }>()

b
  .setId("uniqId")
  .setTitle("my amazing title")
  .withComment("this is my first comment!")
  .build() // should be of instance Post and have all its methods
```

```ts
export type IBuilder<T> = {
  [k in keyof T]-?: (arg: T[k]) => IBuilder<T>
}
& {
  build(): T;
};

type Clazz<T> = new(...args: unknown[]) => T;

export function Builder<T>(type: Clazz<T>, template?: Partial<T>): IBuilder<T>;

export function Builder<T>(template?: Partial<T>): IBuilder<T>;

export function Builder<T>(typeOrTemplate?: Clazz<T> | Partial<T>,
                           template?: Partial<T>): IBuilder<T> {
  let type: Clazz<T> | undefined;
  if (typeOrTemplate instanceof Function) {
    type = typeOrTemplate;
  } else {
    template = typeOrTemplate;
  }

  const built: Record<string, unknown> = template ? Object.assign({}, template) : {};

  const builder = new Proxy(
    {},
    {
      get(target, prop) {
        if ('build' === prop) {
          if (type) {
            // A class name (identified by the constructor) was passed. Instantiate it with props.
            const obj: T = new type();
            return () => Object.assign(obj, {...built});
          } else {
            // No type information - just return the object.
            return () => built;
          }
        }

        return (x: unknown): unknown => {
          built[prop.toString()] = x;
          return builder;
        };
      }
    }
  );

  return builder as IBuilder<T>;
}

class User {
  id: string
}

const builder = Builder(User)

const user = builder.id("myId").build()
```



```ts
class UserBuilder extends AbstractBuilder<User> {
  withPosts(posts: Post[]) {
    this.posts = posts
  }
}

const builder = BuilderFactory.make(UserBuilder)

const user = builder
  .setId("myId")
  .withPosts([])
  .build()
```