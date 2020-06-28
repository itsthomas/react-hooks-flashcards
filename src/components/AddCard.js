import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import ImageUpload from './ImageUpload';

const AddCard = ({ totalDoclNumbers, onAddButtonClick }) => {
  const [newOriginalText, setNewOriginalText] = useState([]);
  const [newTranslatedText, setNewTranslatedText] = useState([]);
  const [imgURL, setimgURL] = useState('');
  const [counter, setCounter] = useState(0);
  const nextNumber = totalDoclNumbers + 1;

  // Will also work  without async await.
  const onAdd = async () => {
    let customIdentification = Number(nextNumber);
    let card = await db.collection('FlashCards').add({
      originalText: newOriginalText,
      translatedText: newTranslatedText,
      imgURL: imgURL,
      customId: customIdentification,
    });

    console.log(counter);
    //console.log(imgURL);
    //setNewOriginalText('');
    // pass the newly created card here so you could use it in `UpdateCard`
    onAddButtonClick(card); // this looks likes where it belongs.
    setCounter(1);
  };

  return (
    <ul className='list'>
      {/* See: https://stackoverflow.com/questions/34006333/cant-type-in-react-input-text-field */}
      {/* And: https://stackoverflow.com/questions/30727837/react-change-input-defaultvalue-by-passing-props */}
      <li className='list__item list__item--add' key={nextNumber}>
        {/* Filling page elements with data from the DB */}
        <input
          type='text'
          className='list__input'
          // readOnly
          defaultValue={nextNumber}
        />
        <div className='list__textarea-wrapper'>
          {imgURL ? (
            <img src={imgURL} alt='' className='img' />
          ) : (
            <textarea
              placeholder='English'
              onChange={(e) => setNewOriginalText(e.target.value)}
            />
          )}
          <ImageUpload
            getURLtoParent={(url) => setimgURL(url)}
            counter={counter}
            setcounter={() => setCounter(0)}
          />
        </div>
        <textarea
          placeholder='Translation'
          onChange={(e) => setNewTranslatedText(e.target.value)}
        />
        <button className='list__btn list__btn--add' onClick={onAdd}>
          Add
        </button>
      </li>
    </ul>
  );
};

export default AddCard;
