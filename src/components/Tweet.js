import { dbService } from "fBase";
import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";


import "./Tweet.css";

const Tweet = ({ tweetObj, isOwner}) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("내용을 삭제 하시겠습니까 ?✂️");
    console.log(ok);
    if (ok) {
      await deleteDoc(doc(dbService, "tweets", `${tweetObj.id}`));
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();

    await updateDoc(doc(dbService, `tweets/${tweetObj.id}`), {
      text: newTweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const { target: { value } } = event;
    setNewTweet(value);
  };

  return (
    <div className="tweet">
      {editing ? (
        <form onSubmit={onSubmit} className="tweetEdit">
          <input
            type="text"
            placeholder="Edit your tweet"
            value={newTweet}
            required
            onChange={onChange}
            className="formInput"
          />
          <input
            type="submit"
            value="Update Tweet"
            className="formBtn"
          />
        </form>
      ) : (
        <>
          <div className="tweetContent">
           
            <p> "{tweetObj.text}"</p>

            {isOwner && (
              <div className="tweetButtons">
                <button onClick={onDeleteClick} className="deleteBtn">Delete</button>
                <button onClick={toggleEditing} className="editBtn">Edit</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
