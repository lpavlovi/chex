import { styled, css } from 'solid-styled-components';
import { createSignal, onMount, onCleanup, createEffect } from 'solid-js';
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
  font-size: 13px;
  font-weight: bold;
  color: white;
  text-align: center;
  line-height: 1;
`;

const Emblem = (props: { visible: boolean, isMac: boolean }) => {
  return (
    <EmblemContainer class={clsx(!props.visible && hiddenClass)}>
      {props.isMac ? '⌘ + K' : 'Ctrl + K'}
    </EmblemContainer>
  );
};

const detectMacOS: () => boolean = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMacOS = /macintosh|mac os x/.test(userAgent);
  return isMacOS;
};

export function App() {
  const [active, setActive] = createSignal(false);
  const [isMac, setIsMac] = createSignal(false);

  const handleClick = (event: MouseEvent) => {
    if (active()) {
      event.preventDefault();
      event.stopPropagation();
      
      const element = event.target as HTMLElement;
      console.log(element);
      
      setActive(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMacOS = isMac();
    console.log(`isMacOS: ${isMacOS}, event.metaKey: ${event.metaKey}, event.key: ${event.key}`);
    const isCorrectKey = isMacOS 
      ? (event.metaKey && event.key === 'k')  // CMD + K on Mac
      : (event.ctrlKey && event.key === 'k'); // CTRL + K on Windows
    
    if (isCorrectKey) {
      event.preventDefault();
      setActive(prev => !prev);
    }
  };

  // Effect to manage click listener based on active state
  createEffect(() => {
    if (active()) {
      document.addEventListener('click', handleClick, true);
    } else {
      document.removeEventListener('click', handleClick, true);
    }
  });

  onMount(() => {
    setIsMac(detectMacOS());
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleClick, true);
  });

  return (
    <AppContainer>
      <Emblem visible={active()} isMac={isMac()} />
    </AppContainer>
  );
}
