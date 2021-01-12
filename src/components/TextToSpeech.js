import React from 'react';

// const TextToSpeech = (props) => {
//   const message = props.message;
//   const language = props.language;
//   const rate = props.rate;
//   const pitch = props.pitch;

// Destructuring
const TextToSpeech = ({ message, language, rate, pitch }) => {
  return (
    <>
      <div
        onClick={(e) => {
          if (message.length > 0) {
            const msg = new SpeechSynthesisUtterance(message);
            msg.lang = language;
            msg.rate = rate;
            msg.pitch = pitch;
            window.speechSynthesis.speak(msg);
          }

          e.stopPropagation();
        }}
        className='listen-button'
      ></div>
    </>
  );
};

export default TextToSpeech;
