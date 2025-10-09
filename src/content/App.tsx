import { styled, css } from 'solid-styled-components';
import { createSignal, onMount, onCleanup } from 'solid-js';
import { clsx } from 'clsx';

const AppContainer = styled("div")`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
`;

const hiddenClass = css`
  visibility: hidden;
`;

const EmblemContainer = styled("div")`
  width: 100%;
  height: 100%;
  background: transparent;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  text-align: center;
  line-height: 1;
`;

const Emblem = (props: { visible: boolean, isMac: boolean }) => {
  return (
    <EmblemContainer class={clsx(props.visible && hiddenClass)}>
      {props.isMac ? '⌘ + K' : 'Ctrl + K'}
    </EmblemContainer>
  );
};

export function App() {
  const [isVisible, setIsVisible] = createSignal(true);
  const [isMac, setIsMac] = createSignal(false);

  const detectOS = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMacOS = /macintosh|mac os x/.test(userAgent);
    setIsMac(isMacOS);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMacOS = isMac();
    console.log(`isMacOS: ${isMacOS}, event.metaKey: ${event.metaKey}, event.key: ${event.key}`);
    const isCorrectKey = isMacOS 
      ? (event.metaKey && event.key === 'k')  // CMD + K on Mac
      : (event.ctrlKey && event.key === 'k'); // CTRL + K on Windows
    
    if (isCorrectKey) {
      event.preventDefault();
      setIsVisible(prev => !prev);
    }
  };

  onMount(() => {
    detectOS();
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <AppContainer>
      <Emblem visible={isVisible()} isMac={isMac()} />
    </AppContainer>
  );
}
