import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import FlipCard from './FlipCard';
import AllFlipCards from './AllFlipCards';

const CardGroups = () => {
  const [cards, setCards] = useState([]);
  const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const [showFlipCard, setShowFlipCard] = useState(false);
  const [showAllFlipCard, setShowAllFlipCards] = useState(false);
  const [showCardGroups, setShowCardGroups] = useState(true);

  const docLimit = 20;

  // console.log(cards);

  useEffect(() => {
    // This first query is only to find out the total number of data in our collection
    // so we can devide them to several pages. (Pagination)
    const firstFetch = async () => {
      const data = await db.collection('FlashCards').get();
      setTotalDoclNumbers(data.docs.length);
      console.log(
        'totalDoclNumbers inside CardGroups.js is: ' + totalDoclNumbers
      );
    };

    const fetchData = async () => {
      // FlashCards is the namee of our collection on FireBase server
      // .get all data from our FireBase collection and save them in to const data
      const data = await db
        .collection('FlashCards')
        .orderBy('customId', 'asc') // or you could use 'desc'
        .limit(1)
        .get();
      // Save firebase db data in cards using the setCards method
      setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    firstFetch();
    fetchData();
  }, [totalDoclNumbers]);

  // Creating a number of cards
  // See https://stackoverflow.com/questions/62499420/react-cloud-firestore-how-can-i-add-pagination-to-this-component/62500027#62500027
  const RenderCardGroups = () =>
    Array(Math.ceil(totalDoclNumbers / docLimit))
      .fill()
      // The _ should be the name of the current element in a map() method
      // Since the current element in this case is undefined, and we don't do anything with it, it's
      // a good practice using an underscore
      // i is the index of the iteration. You don't need to declare it yourself, is provided by map.
      .map((_, i) => {
        return (
          <div key={i} className={'scene scene--list visible'}>
            {cards.map((card) => (
              <div
                key={card.id}
                className={'card'}
                onClick={() => {
                  setStartPoint(docLimit * i);
                  setEndPoint(docLimit * i + docLimit);
                  setShowFlipCard(true);
                }}
              >
                <div className='card__face card__face--front'>
                  {docLimit * i + 1} to {docLimit * i + docLimit}
                </div>
              </div>
            ))}
          </div>
        );
      });

  return (
    <>
      <div className='cards__nav'>
        <button
          className='cards__btn'
          onClick={() => {
            setShowCardGroups(true);
            setShowFlipCard(false);
            setShowAllFlipCards(false);
          }}
        >
          Show all cards in groups
        </button>

        <button
          className='cards__btn'
          onClick={() => {
            setShowFlipCard(true);
            setShowAllFlipCards(false);
          }}
        >
          Go through all cards
        </button>
        <button
          className='cards__btn'
          onClick={() => {
            setShowFlipCard(false);
            setShowAllFlipCards(true);
          }}
        >
          Show all cards side by side
        </button>
      </div>

      {/* Showing Either the CardGroups or the FlipCard */}
      <div
        className={
          showFlipCard || showAllFlipCard || !showCardGroups
            ? 'document hidden'
            : 'document visible'
        }
      >
        {/* Showing all cards in groups */}
        <RenderCardGroups />
      </div>
      {/* Showing only one card */}
      <div className={!showFlipCard ? 'document hidden' : 'document visible'}>
        <FlipCard startPoint={startPoint} endPoint={endPoint} />
      </div>
      {/* Showing all cards */}
      <div
        className={!showAllFlipCard ? 'document hidden' : 'document visible'}
      >
        <AllFlipCards startPoint={startPoint} endPoint={endPoint} />
      </div>
    </>
  );
};

export default CardGroups;
