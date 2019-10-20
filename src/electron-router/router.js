import { EventEmitter } from 'events';

let initiated = false

export class Router extends EventEmitter{
  constructor(schema) {
    super();
    if(initiated) throw new Error('there can only be one router instance');
    registerRouterLink(this);
    this._routes = [];
    this._schema = schema;
    this._activeRoute = { id: 'NO_PAGE_SELECTED' }
    this._parseSchema(schema);
    initiated = true;
    this._history = [];
    this._historyIndex = 0;
  }

  get activeRoute () {
    return this._activeRoute;
  }

  _parseSchema(schema) {
    const parseRoutes = (routes, parentId = null, depth = 0) => {
      for(const [id, route] of Object.entries(routes)) {
        this._routes[id] = {
          ...route,
          parentId,
          depth,
          id
        };

        if(route.subRoutes) {
          parseRoutes(route.subRoutes, id, depth + 1);
        }
      }
    }

    parseRoutes(schema.routes);
  }

  _resolveRouteObject(routeObject, {validateParams = true, params = {}}) {
    if('params' in routeObject && validateParams) {
      for(const [param, paramDefinition] of Object.entries(routeObject.params)) {
        if(paramDefinition.required === true) {
          if(!(param in params)) throw new Error(`Paramter ${param} on route ${routeObject.id} is required`);
        }
        if(paramDefinition.type) {
          switch(paramDefinition.type) {
            case String:
              if(typeof params[param] !== 'string') throw new Error(`Parameter ${param} of route ${routeObject.id} has to be a string`);
              break;
            case Boolean:
              if(typeof params[param] !== 'boolean') throw new Error(`Parameter ${param} of route ${routeObject.id} has to be a string`);
              break;
            case Number:
              if(typeof params[param] !== 'number') throw new Error(`Parameter ${param} of route ${routeObject.id} has to be a string`);
              break;
            case Object:
              if(!(params[param] instanceof Array)) throw new Error(`Parameter ${param} of route ${routeObject.id} has to be a object`);
              break;
            case Array:
              if(!(params[param] instanceof Array)) throw new Error(`Parameter ${param} of route ${routeObject.id} has to be a array`);
              break;
          }
        }
      }
    }

    const resolvedRoute = {
      ...routeObject,
      params
    };

    const partiallyResolvedRoute = {...resolvedRoute};

    if('default' in this._schema) {
      for(const [key, value] of Object.entries(this._schema.default)) {
        if(!(key in resolvedRoute)) {
          resolvedRoute[key] = value;
        }
      }
    }

    for(const [key, value] of Object.entries(resolvedRoute)) {
      if(typeof value === 'function') {
        resolvedRoute[key] = value(partiallyResolvedRoute);
      }
    }

    return resolvedRoute;
  }

  navigate(id, params) {
    if(!(id in this._routes)) throw new Error(`There is no page with the id ${id}`);
    const resolvedRoute = this._resolveRouteObject(this._routes[id], {params});

    const deepEqual = (obj, obj2) => {
      let objKeys = Object.keys(obj)
      if(objKeys.length !== Object.keys(obj2).length) return false;
      for(const key of objKeys) {
        if(typeof obj[key] === 'object') {
          if(typeof obj2 !== 'object') return false;
          if(obj[key] === null) {
            if(!obj2[key] === null) return;
          } else if(!deepEqual(obj[key], obj2[key])) return false;
        } else if(obj[key] !== obj2[key]) {
          return false;
        }
      }
      return true;
    }
    
    if(this._activeRoute.id === resolvedRoute.id) {
      if(deepEqual(this._activeRoute, resolvedRoute)) return;
    }

    if(this._history.length > 19) this._history.shift();
    this._history.splice(this._historyIndex + 1);
    this._history.push(resolvedRoute);
    this._historyIndex = this._history.length - 1;
    
    this._activeRoute = resolvedRoute;
    this.emit('page-change', resolvedRoute);
  }

  back() {
    if(this._historyIndex > 0) {
      const {params, id} = this._history[--this._historyIndex]
      const resolvedRoute = this.resolvePage(id, params);
      this._activeRoute = resolvedRoute;
      this.emit('page-change', resolvedRoute);
    }
  }

  forward() {
    if(this._historyIndex < this._history.length - 1) {
      const {params, id} = this._history[++this._historyIndex]
      const resolvedRoute = this.resolvePage(id, params);
      this._activeRoute = resolvedRoute;
      this.emit('page-change', resolvedRoute);
    }
  }

  resolvePage(id, params) {
    if(!(id in this._routes)) throw new Error(`There is no page with the id ${id}`);
    return this._resolveRouteObject(this._routes[id], {params});
  }

  resolveAll() {
    const resolvedRoutes = [];
    for(const route of Object.values(this._routes)) {
      resolvedRoutes.push(this._resolveRouteObject(route, { validateParams: false }));
    }
    return resolvedRoutes;
  }
  
  get history () {
    return this._history.slice(0, this._historyIndex);
  }

  get forwardsHistory () {
    return this._history.slice(this._historyIndex + 1);
  }

  get canGoForward () {
    return this._historyIndex < this._history.length - 1;
  }

  get canGoBack () {
    return this._historyIndex > 0;
  }
}

const registerRouterLink = routerInstance => {
  class RouterLink extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', () => {
        if(this._route) {
          routerInstance.navigate(this._route, this._params);
        }
      })
    }
  
    static get observedAttributes() {
      return ['route', 'params'];
    }
  
    attributeChangedCallback(name, oldVal, newVal) {
      if(name === 'page') {
        this.route = newVal;
      } else if (name === 'params') {
        this.params = this._parseParams(newVal);
      }
    }
  
    _parseParams(params) {
      if(params) {
        try {
          return JSON.parse(params);
        } catch {
          return params
          .split(';')
          .map(a => a.split(':').map(a => a.trim()))
          .reduce((previous, [name, value]) => {
            return {
              ...previous,
              [name]: value
            }
          },{})
        }
      }
    }

    set route (newVal) {
      if(typeof newVal !== 'string') return;
      this._route = newVal;
    }

    get route () {
      return this._route;
    }

    set params (newVal) {
      if(typeof newVal !== 'object' || newVal === null) return;
      this._params = newVal;
    }

    get params () {
      return this._params;
    }
  }

  window.customElements.define('router-link', RouterLink);
}