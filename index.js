require('reflect-metadata');
const metakeys = ["namespace", "Get", "Post", "Delete", "Put", "Head"];

module.exports["methods"] = metakeys.slice(1).map(item => item.toLowerCase());

metakeys.map(key => {
  module.exports[key] = (path) => (target, name, descriptor) => {
    Reflect.defineMetadata(key, {
      path,
      prototype: name,
      method: key
    }, target, name);
  }
})

module.exports['iterator'] = function (classname, callback) {
  const prefix = Reflect.getMetadata('namespace', classname) || '';
  const ownPropertyNames = Object.getOwnPropertyNames(classname['prototype']);
  ownPropertyNames.forEach(propertyName => {
    metakeys.reduce((ret, cur) => {
      let subroute = Reflect.getMetadata(cur, classname['prototype'], propertyName);
      if (subroute) {
        callback && callback(prefix, subroute)
      }
    }, '')
  })
}