import { render } from 'solid-js/web';

const CONTAINER_ID = 'chex-solid-root';

// Define a simple SolidJS component
function App() {
  return <div>Hello from the SolidJS Content Script!</div>;
}

function createContainerAndMount() {
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  document.body.appendChild(container);
  render(() => <App />, container);
}

// Start the app
createContainerAndMount();
