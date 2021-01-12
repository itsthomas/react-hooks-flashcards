import React from 'react';

const ListenButton = (props) => {
  const message = props.message;
  const language = props.language;
  const rate = props.rate;
  const pitch = props.pitch;

  return (
    <>
    <label onClick={(e) => {
      if(message.length > 0) {
        const msg = new SpeechSynthesisUtterance(message);
        msg.lang = language;
        msg.rate = rate;
        msg.pitch = pitch;
        window.speechSynthesis.speak(msg);
      }

    e.stopPropagation();
  }
} className='listen-button'>
</label>
    </>
  );
};

export default ListenButton;
