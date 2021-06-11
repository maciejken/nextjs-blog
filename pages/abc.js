import diff from 'fast-diff';
import { createRef, useEffect, useState } from 'react';
import classnames from 'classnames';
import { keymaps, keymapOptions } from '../constants/keymaps';
import Layout from '../components/layout';
import Select from '../components/select';
import Button from '../components/button';

function mapKeys(str, dict) {
  return str.split('')
    .map(key => dict && dict[key] ? dict[key] : key)
    .join('');
}

function mapInput({ currentValue, value, keys }) {
  return diff(currentValue, value)
    .map(s => {
      const [mode, str] = s;
      let v;
      if (mode === diff.INSERT) {
        v = mapKeys(str, keymaps[keys]);
      } else if (mode === diff.EQUAL) {
        v = str;
      } else {
        v = '';
      }
      return v;
    })
    .join('');
}

export default function Abc() {
  const [currentValue, setValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [keys, setKeys] = useState('dvorak');
  const [infoTimeout, setInfoTimeout] = useState(null);
  const abcInput = createRef();
  const handleInput = (evt) => {
    const { selectionEnd, value } = evt.target;
    const mappedInput = mapInput({ currentValue, value, keys });
    setValue(mappedInput);
    setCursorPosition(selectionEnd);
  };
  const handleKeymapChange = (evt) => {
    setKeys(evt.target.value);
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
    setValue('');
  };

  useEffect(() => {
    abcInput.current.selectionEnd = cursorPosition;
    return () => {
      if (infoTimeout) {
        clearTimeout(infoTimeout);
      }
    }
  }, [cursorPosition]);

  return (
    <Layout>
      <div className="abc-input-wrapper">
        <textarea
          onInput={handleInput}
          value={currentValue}
          ref={abcInput}
          className={classnames("abc-input", {
            copied: !!infoTimeout,
          })}
        >
        </textarea>
        {infoTimeout && <div className="abc-input-info">Skopiowano!</div>}
      </div>
      <div className="abc-controls row">
        <Button onClick={copyToClipboard}>
          Kopiuj
        </Button>
        <Button onClick={clearText}>
          Wyczyść
        </Button>
        <Select
          options={keymapOptions}
          value={keys}
          name="keymap"
          onChange={handleKeymapChange}
        />
      </div>
      <style jsx>{`
        .abc-input {
          font-size: 1.25rem;
          width: 100%;
          height: 100%;
          resize: none;
          border: 1px solid rgba(0,0,0,.2);
        }
        .copied {
          outline: green solid 2px;
        }
        .abc-input-wrapper {
          margin: 1rem 0 0.5rem;
          position: relative;
          width: 100%;
          height: 300px;
        }
        .abc-input-info {
          width: calc(100% - 4px);
          background-color: rgba(255,255,255, .85);
          position: absolute;
          left: 2px;
          bottom: 2px;
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
