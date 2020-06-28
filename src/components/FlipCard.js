import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import timeOutScroll from '../helpers/timeOutScroll';

const FlipCard = ({ startPoint, endPoint }) => {
  const [cards, setCards] = useState([]);
  const [back, setBack] = useState(false);
  const [finished, setFinished] = useState(false);
  // console.log(cards);

  useEffect(() => {
    const fetchData = async () => {
      // FlashCards is the namee of our collection on FireBase server
      // .get all data from our FireBase collection and save them in to const data
      const data = await db
        .collection('FlashCards')
        .orderBy('customId', 'asc') // or you could use 'desc'
        .startAfter(startPoint)
        .limit(1)
        .get();
      // Save firebase db data in cards using the setCards method
      setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, [startPoint]);

  // Function for Show next button
  const showNext = ({ card }) => {
    const fetchNextData = async () => {
      const data = await db
        .collection('FlashCards')
        .orderBy('customId', 'asc') // or you could use 'desc'
        .startAfter(card.customId)
        .limit(1)
        .get()
        .catch((error) => {
          console.log('end of the row');
        });

      // If there are no more data in the document, setFinished to true
      // This will hide the next button and shows "Start again" button instead
      console.log('CARD: ', card.customId);
      console.log('EndPoint: ', endPoint);

      if (!data.docs.length || card.customId === endPoint) {
        console.log('end of the row');
        setFinished(true);
      }

      // Save firebase db data in cards using the setCards method
      setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchNextData();
    // Show front-side of the card
    setBack(false);
  };

  const refreshPage = () => {
    timeOutScroll();
  };

  return (
    <>
      <div className={finished ? 'scene hidden' : 'scene visible'}>
        {cards.map((card) => (
          <div key={card.id}>
            <div
              key={card.id}
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
      </div>
      {finished ? (
        <div
          className={
            finished
              ? 'card__btn-wrapper note visible'
              : 'card__btn-wrapper note hidden'
          }
        >
          <h3>Finished!</h3>
          <span className='success'>Congratulation!</span>
          <p>That was the last card. You went through all cards.</p>
          <button className='card__btn' onClick={refreshPage}>
            Start again!
          </button>
        </div>
      ) : (
        <div className='card__btn-wrapper'>
          <button
            className='card__btn'
            // Passing the card object to showNext function.
            // The way to know that you're out of docs in a collection is when the number
            // of results (cards.length) is smaller than the limit on the query (.limit(1)).
            // Here, 1 is the limit that we use for our query. It the limit was 50, the number here should be 50 too
            onClick={() => showNext({ card: cards[cards.length - 1] })}
          >
            Next Card
          </button>
        </div>
      )}
    </>
  );
};

export default FlipCard;
