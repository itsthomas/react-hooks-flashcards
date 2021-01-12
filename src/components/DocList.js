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
    // const [searchQuery, setSearchQuery] = useState("");
    const docLimit = 5;

    useEffect(() => {
      const fetchData = async () => {
          // FlashCards is the namee of our collection on FireBase server
          // .get all data from our FireBase collection and save them in to const data

          let flashCards = db.collection('FlashCards');

          // if (searchQuery !== "") {
          //   const end = searchQuery.replace(
          //     /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
          //   );
      
          //   flashCards = flashCards
          //     .where('originalText', '>=', searchQuery)
          //     .where('originalText', '<', end);

          //     console.log('new code working')
          // }

          flashCards.get().then(function (documentSnapshots) {

            const _totalDoclNumbers = documentSnapshots.docs.length;

            if(_totalDoclNumbers > 0) {
            const numberOfPages = Math.ceil(_totalDoclNumbers / docLimit);
            const maxIndex = numberOfPages > 0 ? numberOfPages - 1 : 0;

            let first = db.collection("FlashCards")
            .orderBy("createdAt");

            // if (searchQuery !== "") {
            //   const end = searchQuery.replace(
            //     /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
            //   );
        
            //   first = first
            //     .where('originalText', '>=', searchQuery)
            //     .where('originalText', '<', end);
            // }

            if(beginAfter !== 0) {
              if(beginAfter !== -1) {
                first = first.limit(beginAfter);
              } else if(maxIndex !== 0) {
                first = first.limit(maxIndex * docLimit);
              }           
            }
            
            first.get().then(function (documentSnapshots) {
                  // Get the last visible document
                  var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
                  // Construct a new query starting at this document,
                  // get the next 25 cities.
                  let next = db.collection("FlashCards")
                          .orderBy("createdAt")
                          .limit(docLimit);

                          // if (searchQuery !== "") {
                          //   const end = searchQuery.replace(
                          //     /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
                          //   );
                      
                          //   next = next
                          //     .where('originalText', '>=', searchQuery)
                          //     .where('originalText', '<', end);
                          // }
              

                          if(beginAfter !== 0 && maxIndex !== 0) {
                            next = next.startAfter(lastVisible);
                          }
                          
                          next.get().then(function (documentSnapshots) {
                            // Save firebase db data in cards using the setCards method
                            setCards(documentSnapshots.docs.map((doc) => ({...doc.data(), id: doc.id})));
                            setTotalDoclNumbers(_totalDoclNumbers);
          
                            console.log(beginAfter)
          
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
                
            } else {
              setAddCardVisibility(true);
            }
            
          });
      };

      fetchData();

        //console.log(cards[totalDoclNumbers]);
    }, [beginAfter, totalDoclNumbers]);

    // Extra fetch to get updates results from the FireStore collection after deleting a doc
    const fetchData = async () => {
        db.collection('FlashCards')
            .orderBy('createdAt', 'asc') // or you could use 'desc'
            .limit(docLimit)
            .startAfter(beginAfter)
            .get().then((data)=> {
                // Save firebase db data in cards using the setCards method
                setCards(data.docs.map((doc) => ({...doc.data(), id: doc.id})));

                setTotalDoclNumbers(data.docs.length);

                console.log(data.docs.length)
            });
 
    };

    // const handleSearchInput = (e) => {
    //   setSearchQuery(e.target.value);

    // }  

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

              const documentMenuIsSelected = beginAfter === docLimit * i || (beginAfter===-1 && i===Math.ceil(totalDoclNumbers / docLimit)-1);

              return (
                <div key={i} className={ documentMenuIsSelected ? 'document__set selected' : 'document__set' } onClick={onClick}>
                  {doubleDigit(docLimit * i + 1)} to {' '}
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

                fetchData();
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

        {/* <div className='search-bar'>
        <SearchBar handleSearchInput={handleSearchInput}/>
        </div> */}

        <ul className='list'>
          {cards.map((card, i) => (
            <li key={card.id} className={'list__item'} data-id={card.id}>
              <UpdateCard key={'update-card-'+card.id} number={(beginAfter === -1 ? beginAfterForLastPage() +i+1:beginAfter + i+1 )} card={card} addButtonClickCount={addButtonClickCount}/>
              <DeleteCard key={'delete-card-'+card.id} card={card} fetchData={fetchData}/>
            </li>
          ))}
          {checkLastDock()}
        </ul>
      </>
    )
        
};

export default DocList;
