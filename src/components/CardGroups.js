import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import FlipCardSwipe from './FlipCardSwipe';
import AllFlipCards from './AllFlipCards';

const CardGroups = () => {
  const [cards, setCards] = useState([]);
  const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);
  const [startPoint, setStartPoint] = useState(-1);
  const [endPoint, setEndPoint] = useState(0);
  const [showFlipCardSwipe, setShowFlipCardSwipe] = useState(false);
  const [goThroughAllCards, setGoThroughAllCards]= useState(false);
  const [showAllFlipCard, setShowAllFlipCards] = useState(false);
  const [showCardGroups, setShowCardGroups] = useState(true);

  const docLimit = 5;

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
        .orderBy('createdAt', 'asc') // or you could use 'desc'
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
        let groupLength = docLimit;

if(i===(Math.ceil(totalDoclNumbers / docLimit)-1)) {


  groupLength = totalDoclNumbers - docLimit * i;

}
        return (
          <div key={i} className={'scene-group scene-group--list visible'}>
            {cards.map((card) => (
              <div
                key={card.id}
                className={'card-group'}
                onClick={() => {
                  setStartPoint(docLimit * i);
                  setEndPoint(docLimit * i + groupLength);
                  //setShowFlipCardSwipe(true);
                  //setShowCardGroups(false);
                }}
              >
                <div className='card__face card__face--front'>
                  {docLimit * i + 1} to {docLimit * i + groupLength}
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
          className={'cards__btn '+(showCardGroups?'selected':'')}
          onClick={() => {
            setShowCardGroups(true);
            setShowFlipCardSwipe(false);
            setShowAllFlipCards(false);
            setGoThroughAllCards(false);
          }}
        >
          Show all cards in groups
        </button>

        <button
          className={'cards__btn '+(goThroughAllCards?'selected':'')}
          onClick={() => {
            setShowCardGroups(false);
            setShowFlipCardSwipe(true);
            setGoThroughAllCards(true);
            setShowAllFlipCards(false);
            setStartPoint(0);
            setEndPoint(totalDoclNumbers);
          }}
        >
          Go through all cards
        </button>
        <button
          className={'cards__btn '+(showAllFlipCard?'selected':'')}
          onClick={() => {
            setShowCardGroups(false);
            setShowFlipCardSwipe(false);
            setShowAllFlipCards(true);
            setGoThroughAllCards(false);
          }}
        >
          Show all cards side by side
        </button>
      </div>

      {/* Showing Either the CardGroups or the FlipCard */}
      <div
        className={!showCardGroups ? 'hidden': 'cards__grid'}
      >
        {/* Showing all cards in groups */ <RenderCardGroups />}
        
      </div>

      {/* Showing only one card */}
      <div className={!showFlipCardSwipe ? 'hidden':''}>
        <FlipCardSwipe startPoint={startPoint} endPoint={endPoint} setShowCardGroups={setShowCardGroups} setShowFlipCardSwipe={setShowFlipCardSwipe} goThroughAllCards={goThroughAllCards} setStartPoint={setStartPoint} />
      </div>
      
      {/* Showing all cards */}
      <div
        className={!showAllFlipCard ? 'hidden': 'cards__grid'}
      >
        <AllFlipCards startPoint={startPoint} endPoint={endPoint} />
      </div>
    </>
  );
};

export default CardGroups;
