import { styled } from 'solid-styled-components';
import { createSignal, onMount, onCleanup } from 'solid-js';

const AppContainer = styled("div")`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
`;

const EmblemContainer = styled("div")<{ visible: boolean }>`
  width: 100%;
  height: 100%;
  background: transparent;
  border: 2px solid blue;
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: blue;
  text-align: center;
  line-height: 1;
`;

const Emblem = (props: { visible: boolean, isMac: boolean }) => {
  return (
    <EmblemContainer visible={props.visible}>
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
    const isWindows = /windows|win32|win64/.test(userAgent);
    
    setIsMac(isMacOS);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMacOS = isMac();
    const isCorrectKey = isMacOS 
      ? (event.metaKey && event.key === 'K')  // CMD + K on Mac
      : (event.ctrlKey && event.key === 'K'); // CTRL + K on Windows
    
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
