import { useState, useEffect } from 'react';
import { keymapOptions, navLinks, toastMillis } from '../constants';
import Layout from '../components/layout';
import Select from '../components/select';
import Button from '../components/button';
import TextArea from '../components/textarea';

export default function WriteInPolish() {
  const [keyboard, setKeyboard] = useState('dvorak');
  const [toastTimeout, setToastTimeout] = useState(null);
  const [isTextCopied, setTextCopied] = useState(false);
  const [isTextCleared, setTextCleared] = useState(false);
  const tabOffset = navLinks.length;

  const handleKeymapChange = (evt) => {
    setKeyboard(evt.target.value);
  };
  const dispatchWithTimeout = fn => {
    fn(true);
    const timeout = setTimeout(() => fn(false), toastMillis);
    setToastTimeout(timeout);
  };
  const handleCopyClicked = () => {
    dispatchWithTimeout(setTextCopied);
  }
  const handleClearClicked = () => {
    dispatchWithTimeout(setTextCleared);
  }

  useEffect(() => {
    return () => {
      clearTimeout(toastTimeout);
    };
  }, []);

  return (
    <Layout>
      <TextArea
        isTextCopied={isTextCopied}
        isTextCleared={isTextCleared}
        keyboard={keyboard}
        tabIndex={tabOffset + 1}
      />
      <div className="abc-controls row">
        <Button onClick={handleCopyClicked} tabIndex={tabOffset + 2}>
          Kopiuj
        </Button>
        <Button onClick={handleClearClicked} tabIndex={tabOffset + 3}>
          Wyczyść
        </Button>
        <Select
          options={keymapOptions}
          value={keyboard}
          name="keymap"
          onChange={handleKeymapChange}
          tabIndex={tabOffset + 4}
        />
      </div>
      <style jsx>{`
        .abc-controls {
          justify-content: space-between;
          align-items: stretch;
          margin-bottom: 1rem;
        }
      `}</style>
    </Layout>
  )
}
