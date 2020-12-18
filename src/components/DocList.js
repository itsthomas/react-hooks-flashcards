import React, {useState, useEffect} from 'react';
import {db} from '../firebase';
import UpdateCard from './UpdateCard';
import AddCard from './AddCard';
import DeleteCard from './DeleteCard';

const DocList = () => {
    const [cards, setCards] = useState([]);
    const [beginAfter, setBeginAfter] = useState(-1);
    const [addCardIsVisible, setAddCardVisibility] = useState(false);
    const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);
    const [addButtonClickCount, setAddButtonClickCount] = useState(0);
    const docLimit = 5;    

    useEffect(() => {
      const fetchData = async () => {
          // FlashCards is the namee of our collection on FireBase server
          // .get all data from our FireBase collection and save them in to const data
          const flashCards = db.collection('FlashCards');

          flashCards.get().then(function (documentSnapshots) {
            const _totalDoclNumbers = documentSnapshots.docs.length;
            const numberOfPages = Math.ceil(_totalDoclNumbers / docLimit);
            const maxIndex = numberOfPages > 0 ? numberOfPages - 1 : 0;

            db
              .collection('FlashCards')
              .orderBy('createdAt', 'asc') // or you could use 'desc'
              .limit(docLimit)
              .startAfter(beginAfter !== -1 ? beginAfter : (maxIndex * docLimit))
              .get().then(function (documentSnapshots) {
                  // Save firebase db data in cards using the setCards method
                  setCards(documentSnapshots.docs.map((doc) => ({...doc.data(), id: doc.id})));

                  setTotalDoclNumbers(_totalDoclNumbers);

                  let i = _totalDoclNumbers / docLimit;
                  let lastBlock = docLimit * (i - 1);
                  if (beginAfter >= lastBlock || beginAfter === -1) {
                      setAddCardVisibility(true);
                  }
                  else {
                      setAddCardVisibility(false);
                  }
              }
            );
          });
      };

      fetchData();

        //console.log(cards[totalDoclNumbers]);
    }, [beginAfter, totalDoclNumbers]);

    // Extra fetch to get updates results from the FireStore collection after deleting a doc
    const fetchDataByCustomId = async () => {
        const data = await db
            .collection('FlashCards')
            .orderBy('createdAt', 'asc') // or you could use 'desc'
            .limit(docLimit)
            .startAfter(beginAfter)
            .get();
        // Save firebase db data in cards using the setCards method
        setCards(data.docs.map((doc) => ({...doc.data(), id: doc.id})));

        setTotalDoclNumbers(data.docs.length);

        console.log(data.docs.length)
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
              const onClick = (event) => {
                setBeginAfter(docLimit * i);
              };

              const documentMenuIsSelected = beginAfter===docLimit * i || (beginAfter===-1 && i===Math.ceil(totalDoclNumbers / docLimit)-1);

              return (
                <div key={i} className={documentMenuIsSelected ?'document__set selected':'document__set'} onClick={onClick}>
                  {doubleDigit(docLimit * i + 1)} to{' '}
                  {doubleDigit(docLimit * i + docLimit)}
                </div>
              );
          });

    const checkLastDock = () => {
      if (addCardIsVisible) {
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

    const beginAfterForLastPage = () => {
      return ((Math.ceil(totalDoclNumbers / docLimit)-1)*docLimit);
    }

    return (
        <>
        <div className='document'>
          <RenderDocumentMenu/>
        </div>

        <ul className='list'>
          {cards.map((card, i) => (
            <li key={card.id} className={'list__item '} data-id={card.id}>
              <UpdateCard number={(beginAfter === -1 ? beginAfterForLastPage() +i+1:beginAfter + i+1 )} card={card} addButtonClickCount={addButtonClickCount}/>
              <DeleteCard card={card} fetchDataByCustomId={fetchDataByCustomId}/>
            </li>
          ))}
          {checkLastDock()}
        </ul>
      </>
    )
        
};

export default DocList;
