import React, { useState } from 'react';
import { db } from '../firebase';
import ImageUpload from './ImageUpload';

// card is the prop coming from List.js
// We use distructuring for the card to access its propeties such as card.id
const UpdateCard = ({ card }) => {
  const [originalText, setOriginalText] = useState(card.originalText);
  const [translatedText, setTranslatedText] = useState(card.translatedText);
  const [imgURL, setimgURL] = useState(card.imgURL);
  const [customId, setCustomId] = useState(card.customId);
  //console.log(card.id);
  // Connecting to firebase and writing in to DB
  // FlashCards is the name of my collection on FireBase server
  // Will also work  without async await.
  const onUpdate = async () => {
    console.log(card.id);
    await db
      .collection('FlashCards')
      .doc(card.id)
      .limit(1) // I added this aftr Fikir was finished
      // .set or .update transfers new data to the FireBase DataBase (FlashCards collection)
      .update({ ...card, customId, originalText, translatedText, imgURL });
    // .set({ ...card, originalText, translatedText, imgURL });
  };

  return (
    <>
      <input
        type='text'
        className='list__input'
        value={customId}
        onChange={(e) => {
          setCustomId(Number(e.target.value));
        }}
      />
      {/* Filling elements with data from the DB */}
      <div className='list__textarea-wrapper'>
        {imgURL ? (
          <img src={imgURL} alt='' className='img' />
        ) : (
          <textarea
            value={originalText}
            onChange={(e) => {
              setOriginalText(e.target.value);
            }}
          />
        )}
        <ImageUpload
          getURLtoParent={(url) => {
            setimgURL(url);
            setOriginalText('');
          }}
        />
      </div>

      <textarea
        value={translatedText}
        onChange={(e) => {
          setTranslatedText(e.target.value);
        }}
      />
      <button className='list__btn list__btn--update' onClick={onUpdate}>
        Update
      </button>
    </>
  );
};

export default UpdateCard;
