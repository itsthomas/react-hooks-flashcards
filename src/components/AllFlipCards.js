import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import FlipCard from './FlipCard';

const AllFlipCards = () => {
  const [cards, setCards] = useState([]);
  // console.log(cards);

  useEffect(() => {
    const fetchData = async () => {
      // FlashCards is the namee of our collection on FireBase server
      // .get all data from our FireBase collection and save them in to const data
      const data = await db
        .collection('FlashCards')
        .orderBy('createdAt', 'asc') // or you could use 'desc'
        .get();
      // Save firebase db data in cards object using the setCards method
      setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  return (
    <>
      {cards.map((card) => (
       <FlipCard key={card.id} card={card}/>
      ))}
    </>
  );
};

export default AllFlipCards;
