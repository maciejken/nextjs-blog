import diff from 'fast-diff';
import { useEffect, useState } from 'react';
import keyMaps from '../constants/keymaps';
import Link from 'next/link';

function mapKeys(str, dict) {
  return str.split('')
    .map(key => dict && dict[key] ? dict[key] : key)
    .join('');
}

function mapInput({ currentValue, value, keyMap }) {
  return diff(currentValue, value)
    .map(s => {
      const [mode, str] = s;
      let v;
      if (mode === diff.INSERT) {
        v = mapKeys(str, keyMaps[keyMap]);
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
  const handleInput = (evt) => {
    const { selectionEnd, value } = evt.target;
    const mappedInput = mapInput({ currentValue, value, keyMap: 'dvorakToPuk' });
    setValue(mappedInput);
    setCursorPosition(selectionEnd);
  };

  useEffect(() => {
    const textarea = document.getElementById('abc-input');
    textarea.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  return (
    <div className="container">
      <textarea onInput={handleInput} value={currentValue} id="abc-input"></textarea>
      <Link href="/">
        <a className="link-to-index">← Strona główna</a>
      </Link>
    </div>
  )
}
