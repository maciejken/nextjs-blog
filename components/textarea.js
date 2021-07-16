import { createRef, useEffect, useState } from 'react';
import classnames from 'classnames';
import { keymaps, localStorageKey, textAreaId } from '../constants';
import styles from './textarea.module.css';

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

export default function TextArea({
  isTextCleared,
  isTextCopied,
  keyboard,
  tabIndex,
}) {

  const [currentValue, setCurrentValue] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const textArea = createRef();
  const toastActive = isTextCopied || isTextCleared;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentValue);
  };
  const clearText = () => {
    copyToClipboard();
    setCurrentValue('');
    localStorage.setItem(localStorageKey, '');
  };

  const dispatchInput = ({ value, selectionEnd }) => {
    const textArea = document.getElementById(textAreaId);
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
  const handleKeyDown = (evt) => {
    const shouldMapKey = !!keymaps[keyboard] &&
      !evt.ctrlKey &&
      (evt.key.length === 1 || evt.key === 'Enter');
    if (shouldMapKey) {
      evt.preventDefault();
      const key = keymaps[keyboard]?.keys[evt.key] || '';
      const altKey = keymaps[keyboard]?.altKeys[evt.key] || '';
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

  useEffect(() => {
    const value = localStorage.getItem(localStorageKey) || '';
    setCurrentValue(value);
  }, []);

  useEffect(() => {
    textArea.current.selectionStart = selectionStart;
    textArea.current.selectionEnd = selectionEnd;
    scrollToBottom(textArea.current);
    localStorage.setItem(localStorageKey, currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isTextCopied) {
      copyToClipboard();
    } else if (isTextCleared) {
      clearText();
    }
  }, [isTextCleared, isTextCopied]);

  return (
    <div className={styles.textAreaWrapper}>
      <textarea
        onClick={handleClick}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        value={currentValue}
        ref={textArea}
        className={classnames(styles.textArea, {
          [styles.withToast]: toastActive,
        })}
        tabIndex={tabIndex}
        id={textAreaId}
      >
      </textarea>
      {toastActive && <div className={styles.textAreaToast}>Skopiowano!</div>}
    </div>
  );
}
