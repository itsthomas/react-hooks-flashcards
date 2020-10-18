import React, { useState } from 'react';
import TextToSpeech from './TextToSpeech';

const FlipCard = ({ card }) => {
  // const card = props.card;
  const [back, setBack] = useState(false);

  const backLang = card.imgURL ? 'en-GB' : 'de-DE';

  return (
    <>
      <div className={'scene scene--list visible'}>
        <div
          key={card.id}
          className={back ? 'card is-flipped' : 'card'}
          onClick={() => setBack(!back)}
        >
          <div className='card__face card__face--front'>
            {!card.imgURL ? (
              <TextToSpeech
                message={card.originalText}
                language={'en-GB'}
                pitch={1}
                rate={0.7}
              />
            ) : (
              ''
            )}
            {!back ? <div className='custom-id'>{card.customId}</div> : ''}
            {card.imgURL ? <img src={card.imgURL} alt='' /> : card.originalText}
          </div>
          <div className='card__face card__face--back'>
            <TextToSpeech
              message={card.translatedText}
              language={backLang}
              pitch={1}
              rate={0.7}
            />
            {card.translatedText}
          </div>
        </div>
      </div>
    </>
  );
};

export default FlipCard;
