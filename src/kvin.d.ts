declare module 'kvin' {
  function deserialize(data: any): string
  function serialize(data: string): any
  var userCtors: Record<string, constructor>
  export = { deserialize, serialize, userCtors }
}
