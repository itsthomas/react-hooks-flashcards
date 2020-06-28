import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import UpdateCard from './UpdateCard';
import AddCard from './AddCard';
import DeleteCard from './DeleteCard';

const DocList = () => {
  const [cards, setCards] = useState([]);
  const [beginAfter, setBeginAfter] = useState(0);
  const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);
  const [addButtonClickCount, setAddButtonClickCount] = useState(0);
  const docLimit = 10;

  useEffect(() => {
    // This first query is only to find out the total number of data in our collection
    // so we can devide them to several pages. (Pagination)
    const firstFetch = async () => {
      const data = await db.collection('FlashCards').get();
      setTotalDoclNumbers(data.docs.length);

      console.log('totalDoclNumbers is: ' + totalDoclNumbers);
    };

    const fetchData = async () => {
      // FlashCards is the namee of our collection on FireBase server
      // .get all data from our FireBase collection and save them in to const data
      const data = await db
        .collection('FlashCards')
        .orderBy('customId', 'asc') // or you could use 'desc'
        .limit(docLimit)
        .startAfter(beginAfter)
        .get();
      // Save firebase db data in cards using the setCards method
      setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    firstFetch();
    fetchData();
    //console.log(cards[totalDoclNumbers]);
  }, [beginAfter, totalDoclNumbers]);

  // Extra fetch to get updates results from the FireStore collection after deleting a doc
  const fetchDataByCustomId = async () => {
    const data = await db
      .collection('FlashCards')
      .orderBy('customId', 'asc') // or you could use 'desc'
      .limit(docLimit)
      .startAfter(beginAfter)
      .get();
    // Save firebase db data in cards using the setCards method
    setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    setTotalDoclNumbers(data.docs.length);
  };

  // Adding a 0 before single digit number such as 1, 2, 3, etc.
  const doubleDigit = (d) => {
    return d < 10 ? '0' + d.toString() : d.toString();
  };
  // Creating a pagination menu for our documents (100 documents per each menu)
  // See https://stackoverflow.com/questions/62499420/react-cloud-firestore-how-can-i-add-pagination-to-this-component/62500027#62500027
  const RenderDocumentMenu = () =>
    Array(Math.ceil(totalDoclNumbers / docLimit))
      .fill()
      // The _ should be the name of the current element in a map() method
      // Since the current element in this case is undefined, and we don't do anything with it, it's
      // a good practice using an underscore
      // i is the index of the iteration. You don't need to declare it yourself, is provided by map.
      .map((_, i) => {
        const onClick = () => setBeginAfter(docLimit * i);
        return (
          <div key={i} className='document__set' onClick={onClick}>
            {doubleDigit(docLimit * i + 1)} to{' '}
            {doubleDigit(docLimit * i + docLimit)}
          </div>
        );
      });
  const checkLastDock = () => {
    let i = totalDoclNumbers / docLimit;
    let lastBlock = docLimit * (i - 1);
    if (beginAfter >= lastBlock) {
      return (
        <AddCard
          totalDoclNumbers={totalDoclNumbers}
          onAddButtonClick={(card) => {
            setAddButtonClickCount((c) => c + 1);

            fetchDataByCustomId();

            console.log(cards);
          }}
        />
      );
    } else {
      return null;
    }
  };
  return (
    <div>
      <div className='document'>
        <RenderDocumentMenu />
      </div>

      <ul className='list'>
        {cards.map((card) => (
          <li key={card.id} className='list__item' data-id={card.id}>
            <UpdateCard card={card} addButtonClickCount={addButtonClickCount} />
            <DeleteCard card={card} fetchDataByCustomId={fetchDataByCustomId} />
          </li>
        ))}
        {checkLastDock()}
      </ul>
    </div>
  );
};

export default DocList;
