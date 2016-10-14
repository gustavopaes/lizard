# Example

```js
import Lizard from '../index';

class MyApp extends Lizard {
  constructor() {
    super();

    // Initial component data.
    // This object is the view method scope.
    this.data({
      isCounting: false,
      counter: 1
    });

    // render view on #app container
    this.render(document.querySelector('#app'));
  }

  startCount() {
    if(this.data('isCounting') === false) {
      this.started = setInterval(() => {
        // making changes on data will trigger view redraw
        this.data({
          isCounting: true,
          counter: this.data('counter') + 1
        });
      }, 30);
    } else {
      this.data('isCounting', false);
      clearInterval(this.started);
    }
  }

  getButtonLabel() {
    return this.data('isCounting') ? 'Stop' : 'Start';
  }

  /**
   * View have a controller parameter with the component instance.
   * The view scope is the data object.
   */
  view(ctrl) {
    return Lizard.html`
      <div>
        <h1>Hello ${this.counter} times</h1>
        <button onclick=${ctrl.startCount.bind(ctrl)}>${ctrl.getButtonLabel()}</button>
      </div>
    `
  }
}

window.app = new MyApp();
```
