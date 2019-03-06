require('reflect-metadata');
const methods = [
  "get", "post", "put", "head", "delete", "all", "options", "patch"
];
const metakeys = ["controller"].concat(methods).map(item => {
  return item.replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  });
});

const Exports = {};

metakeys.map(key => {
  Exports[key] = (path) => (target, name) => {
    Reflect.defineMetadata(key, {
      path,
      prototype: name,
      method: key
    }, target, name);
  }
})

Exports['iterator'] = function (classname, callback) {
  const prefix = Reflect.getMetadata('Controller', classname) || '';
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

Exports['Service'] = (service) => (target, name) => {
  Reflect.defineMetadata('Service', service, target, name);
}

Exports['getService'] = (service) => {
  return Reflect.getMetadata('Service', service);
}

Exports['Middleware'] = (middleware) => (target, name) => {
  Reflect.defineMetadata('Middleware', middleware, target, name);
}

Exports['getMiddleware'] = (middleware) => {
  return Reflect.getMetadata('Middleware', middleware);
}

Exports["methods"] = methods;

module.exports = Exports;