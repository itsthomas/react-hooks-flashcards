import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

const FlipCard = ({ startPoint, endPoint }) => {
  const [cards, setCards] = useState([]);
  const [back, setBack] = useState(false);
  // console.log(cards);

  useEffect(() => {
    const fetchData = async () => {
      // FlashCards is the namee of our collection on FireBase server
      // .get all data from our FireBase collection and save them in to const data
      const data = await db
        .collection('FlashCards')
        .orderBy('customId', 'asc') // or you could use 'desc'
        .get();
      // Save firebase db data in cards object using the setCards method
      setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  return (
    <>
      {cards.map((card) => (
        <div key={card.id} className={'scene scene--list visible'}>
          <div
            className={back ? 'card is-flipped' : 'card'}
            onClick={() => setBack(!back)}
          >
            <div className='card__face card__face--front'>
              <div className='custom-id'>{card.customId}</div>
              {card.imgURL ? (
                <img src={card.imgURL} alt='' />
              ) : (
                card.originalText
              )}
            </div>
            <div className='card__face card__face--back'>
              {card.translatedText}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FlipCard;
