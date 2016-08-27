import vdom from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import hyperx from 'hyperx';
import mainLoop from 'main-loop';

const hx = hyperx(vdom.h);

class Lizard {
  static get html() {
    return hx;
  }

  constructor(element) {
    // component data
    this._data = {};

    // component DOM container
    this._element = element;

    // first render
    this._fisrtRender = true;

    // redraw instance
    this._redraw = this.redraw.bind(this);

    // list of components to redraw after some change
    this._redrawTo = [];
  }

  // get/set values.
  // redraw if some data was defined
  data(attr, value) {
    if(attr === undefined) {
      return this._data;
    }

    if(typeof attr === 'string' && value === undefined) {
      return this._data[attr];
    }

    if(value !== undefined) {
      if(Array.isArray(this._data[attr]) === true) {
        this._data[attr].push(value);
      } else if(typeof this._data[attr] === 'object') {
        Object.assign(this._data[attr], value);
      } else {
        this._data[attr] = value;
      }
    } else {
      Object.assign(this._data, attr);
    }

    this.redraw();
  }

  render(element) {
    if(!this._element && element) {
      this._element = element;
    }

    if(!this._element) {
      throw new Error('Please ensure the DOM element exists or was defined before ' +
        'rendering a template into it.');
    }

    if(this._fisrtRender === false) {
      throw new Error('This component has been mounted.');
    }

    // create virtual dom
    this._mainLoop = mainLoop(this.data(), () => this.view.call(this.data(), this), vdom);

    this._element.appendChild(this._mainLoop.target);

    return new Promise((resolve) => {
      resolve(this._mainLoop.target);
    });
  }

  toRender(instance) {
    if(instance) {
      Object.assign(this, instance);
    }

    return this.view.call(this.data(), this);
  }

  redrawTo(instance) {
    this._redrawTo.push(instance);
  }

  redraw() {
    // not every component have a render
    if(this._mainLoop) {
      this._mainLoop.update(this.data());
    }

    this._redrawTo.forEach(instance => instance.redraw());
  }
}

export default Lizard;
