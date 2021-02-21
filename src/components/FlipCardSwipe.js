import React, { useState, useEffect } from 'react';
import FlipCard from './FlipCard';

const FlipCardSwipe = ({cards, startPoint, endPoint, setShowCardGroups, setShowFlipCardSwipe, goThroughAllCards, setStartPoint}) => {
  const [card, setCard] = useState({});
  const [complete, setcomplete] = useState(false);
  const [cardNumber, setCardNumber] = useState(startPoint+1);
  // console.log(cards);

  useEffect(() => {
    const fetchData = async () => {

      if(cards.length > 0) {
        setCard({ ...cards[startPoint], id: cards[startPoint].id, cardsArrayIndex: startPoint });
        setCardNumber(startPoint + 1);

        //Hide CardGroups
        setShowCardGroups(false);

        //Show FlipCardSwipe
        setShowFlipCardSwipe(true);
      } else {
         //Hide FlipCardSwipe
         setShowFlipCardSwipe(false);
      }
        
    };

    if(startPoint > -1)
        fetchData();

  }, [startPoint, setShowFlipCardSwipe, setShowCardGroups, cards]);

  // Function for Show next button
  const showNext = ({ card }) => {
    
    const fetchNextData = () => {
      if(card.id !== null) {
      
        // If there are no more data in the document, setcomplete to true
        // This will hide the next button and shows "Start again" button instead
  
        if (card.cardsArrayIndex + 2 === endPoint) {
          console.log('end of the row');
          setcomplete(true);
        }
  
        // Save firebase db data in cards using the setCards method
        setCard({ ...cards[card.cardsArrayIndex+1], id: cards[card.cardsArrayIndex+1].id, cardsArrayIndex: card.cardsArrayIndex+1 });
        setCardNumber(card.cardsArrayIndex+2);

      } else {

        // If there are no more data in the document, setcomplete to true
        // This will hide the next button and shows "Start again" button instead

        if (card.cardsArrayIndex+2 === endPoint) {
          console.log('end of the row');
          setcomplete(true);
        }
  
        // Save firebase db data in cards using the setCards method
        setCard({ ...cards[0], id: cards[0].id, cardsArrayIndex: startPoint + 1 });
        setCardNumber(startPoint + 1);
   
      }
    };

    fetchNextData();
  };


  const startAgain = () => {
    setcomplete(false);
    setStartPoint(-1);

    if(goThroughAllCards) {
      setShowCardGroups(false);
      setShowFlipCardSwipe(true);
      showNext({ card: {id:null} });
    } else {
      setShowCardGroups(true);
      setShowFlipCardSwipe(false);
    }


  }

  return (
    <>
      <div className={complete ? 'scene hidden' : 'scene visible'}>
        {
          <FlipCard number={cardNumber} key={card.id} card={card}/>
       }
      </div>
      {complete ? (
        <div
          className={
            complete
              ? 'card__btn-wrapper note visible'
              : 'card__btn-wrapper note hidden'
          }
        >
          <h3>Completed!</h3>
          <button className='card__btn' onClick={startAgain}>
            Show Overview
          </button>
        </div>
      ) : (
        <div className='card__btn-wrapper'>
          <button
            className='card__btn'
            // Passing the current card object to showNext function.
            onClick={() => showNext({ card: card })}
          >
            Next Card
          </button>
        </div>
      )}
    </>
  );
};

export default FlipCardSwipe;
