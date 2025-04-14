import { createApp, defineCustomElement } from 'vue/dist/vue.esm-browser.js';

// Define un componente básico
const MyComponent = {
  template: `<div>
               <h2>Hola desde Vue</h2>
               <p>Este es un Web Component en Vue.</p>
             </div>`
};

// Convierte el componente en un Custom Element
const MyElement = defineCustomElement(MyComponent);

// Registra el Web Component
customElements.define('vueTest', MyElement);
