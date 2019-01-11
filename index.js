require('reflect-metadata');
const methods = ["Get", "Post", "Delete", "Put", "Head"];
const controller = ['Namespace', 'Controller'];
const service = ['Service'];
const metakeys = ["Controller", "Get", "Post", "Delete", "Put", "Head"];

module.exports["methods"] = methods.map(item => item.toLowerCase());

metakeys.map(key => {
  module.exports[key] = (path) => (target, name, descriptor) => {
    Reflect.defineMetadata(key, {
      path,
      prototype: name,
      method: key
    }, target, name);
  }
})

module.exports['Service'] = (service) => (target, name, descriptor) => {
  Reflect.defineMetadata('Service', service, target, name);
}

module.exports['getServiceName'] = (classname) => {
  return Reflect.getMetadata('Service', classname);
}


module.exports['iterator'] = function (classname, callback) {
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