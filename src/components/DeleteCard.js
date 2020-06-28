import React from 'react';
import { db } from '../firebase';
// Importing SweetAlert2-react
import Swal from 'sweetalert2';

// card is the prop coming from List.js
// We use distructuring for the card to access its propeties such as card.id
const DeleteCard = ({ card, fetchDataByCustomId }) => {
  // Will also work  without async await.
  const onDelete = () => {
    db.collection('FlashCards').doc(card.id).delete();

    // fetch to get updated results from the FireStore collection after deleting a doc
    // This function also triggers a rendering of DockList
    fetchDataByCustomId();
  };

  // Showing the item to be delete in the Alert
  const item = card.imgURL
    ? `<img src="${card.imgURL}">`
    : card.originalText
    ? card.originalText
    : card.translatedText;

  // The confirmation alert
  const sweetAlert = () =>
    Swal.fire({
      title: 'Are you sure?',
      html: `<strong>${item}</strong> will be removed permanently!`, // instead of html you could also use text:
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.value) {
        onDelete();
      }
    });

  return (
    <button className='list__btn list__btn--delete' onClick={sweetAlert} />
  );
};

export default DeleteCard;
