import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';

const ImageUpload = ({ getURLtoParent }) => {
  const allInputs = { imgUrl: '' };
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Passing imageAsUrl.imgUrl to parent component (UpdateCard and AddCard)
  if (imageAsUrl.imgUrl) {
    getURLtoParent(imageAsUrl.imgUrl);
  }

  useEffect(() => {
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        'state_changed',
        (snapShot) => {
          // Takes a snap shot of the process as it is happening
          console.log(snapShot);
        },
        (error) => {
          //catches the errorors
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              setImageAsUrl((prevObject) => ({
                ...prevObject,
                imgUrl: fireBaseUrl,
              }));
            });
        }
      );
    }
  }, [image]);

  return (
    <>
      <label className='custom-file-upload'>
        <input type='file' onChange={handleChange} />
      </label>
    </>
  );
};

export default ImageUpload;
