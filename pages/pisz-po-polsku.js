import { createRef, useEffect, useState } from 'react';
import classnames from 'classnames';
import { keymaps, keymapOptions } from '../constants/keymaps';
import { navLinks } from '../constants/navlinks';
import Layout from '../components/layout';
import Select from '../components/select';
import Button from '../components/button';

const getTextAreaSetterByPropName = (propName) => {
  return Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, propName
  ).set;
}

const scrollToBottom = (el) => {
  const { clientHeight, scrollHeight, selectionEnd, value } = el;
  const shouldScroll =
    selectionEnd === value.length && clientHeight < scrollHeight;
  if (shouldScroll) {
    el.scrollTop = scrollHeight - clientHeight;
  }
}

const localStorageKey = 'AbcInput';

export default function Abc() {
  const [currentValue, setCurrentValue] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [keyboard, setKeyboard] = useState('dvorak');
  const [infoTimeout, setInfoTimeout] = useState(null);
  const tabOffset = navLinks.length;

  const abcInput = createRef();

  const dispatchInput = ({ value, selectionEnd }) => {
    const textArea = document.getElementById('abc-input');
    const valueSetter = getTextAreaSetterByPropName('value');
    valueSetter.call(textArea, value);
    const selectionStartSetter = getTextAreaSetterByPropName('selectionStart');
    selectionStartSetter.call(textArea, selectionEnd + 1);
    const selectionEndSetter = getTextAreaSetterByPropName('selectionEnd');
    selectionEndSetter.call(textArea, selectionEnd + 1);
    const inputEvt = new Event('input', { bubbles: true });
    textArea.dispatchEvent(inputEvt);
  };
  const handleClick = (evt) => {
    const x = evt.target.selectionStart;
    setSelectionEnd(x);
    setSelectionStart(x);
  };
  const handleInput = (evt) => {
    // console.log('input', evt);
    setSelectionStart(evt.target.selectionStart);
    setSelectionEnd(evt.target.selectionEnd);
    setCurrentValue(evt.target.value);
    evt.target.selectionEnd = selectionEnd;
  };
  const handleKeymapChange = (evt) => {
    setKeyboard(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    const shouldMapKey = !evt.ctrlKey &&
      (evt.key.length === 1 || evt.key === 'Enter');
    if (shouldMapKey) {
      evt.preventDefault();
      const key = keymaps[keyboard].keys[evt.key] || '';
      const altKey = keymaps[keyboard].altKeys[evt.key] || '';
      const leftPart = currentValue.substring(0, evt.target.selectionStart);
      const rightPart = currentValue.substring(evt.target.selectionEnd);
      const value = `${leftPart}${evt.altKey ? altKey : key}${rightPart}`;
      if (key || altKey) {
        const x = evt.target.selectionStart + 1;
        setSelectionEnd(x);
        setSelectionStart(x);
      }
      dispatchInput({ value, selectionEnd });
    } else if (evt.key === 'Alt') {
      evt.preventDefault();
    }
  };
  const showInfo = () => {
    const timeout = setTimeout(() => {
      setInfoTimeout(null);
    }, 2000);
    setInfoTimeout(timeout);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentValue);
    showInfo();
  };
  const clearText = () => {
    copyToClipboard();
    setCurrentValue('');
    localStorage.setItem(localStorageKey, '');
  };

  useEffect(() => {
    const value = localStorage.getItem(localStorageKey) || '';
    setCurrentValue(value);
  }, []);

  useEffect(() => {
    abcInput.current.selectionStart = selectionStart;
    abcInput.current.selectionEnd = selectionEnd;
    scrollToBottom(abcInput.current);
    localStorage.setItem(localStorageKey, currentValue);
    return () => {
      if (infoTimeout) {
        clearTimeout(infoTimeout);
      }
    }
  }, [currentValue]);

  return (
    <Layout>
      <div className="abc-input-wrapper">
        <textarea
          onClick={handleClick}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          value={currentValue}
          ref={abcInput}
          className={classnames("abc-input", {
            copied: !!infoTimeout,
          })}
          tabIndex={tabOffset + 1}
          id="abc-input"
        >
        </textarea>
        {infoTimeout && <div className="abc-input-info">Skopiowano!</div>}
      </div>
      <div className="abc-controls row">
        <Button onClick={copyToClipboard} tabIndex={tabOffset + 2}>
          Kopiuj
        </Button>
        <Button onClick={clearText} tabIndex={tabOffset + 3}>
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
        .abc-input {
          font-size: 1.25rem;
          width: 100%;
          min-height: 300px;
          border: 1px solid rgba(0,0,0,.2);
        }
        .copied {
          outline: green solid 2px;
        }
        .abc-input-wrapper {
          margin: 2rem 0 0.5rem;
          position: relative;
          width: 100%;
        }
        .abc-input-info {
          width: calc(100% - 4px);
          background-color: rgba(255,255,255, .85);
          position: absolute;
          left: 2px;
          bottom: calc(0.5rem + 2px);
          padding: 0.5rem 1rem;
          color: green;
          text-align: right;
        }
        .abc-controls {
          justify-content: space-between;
          align-items: stretch;
          margin-bottom: 1rem;
        }
      `}</style>
    </Layout>
  )
}
