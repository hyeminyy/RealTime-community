import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "fBase";
import { updateProfile } from "firebase/auth";

import "./Profile.css";

export default ({refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    
    history.push("/");
  };

  const getMyTweets = async () => {
    const q = query(collection(dbService, "tweets"), where("creatorId", "==", userObj.uid));
    const orderedQuery = query(q, orderBy("createdAt", "desc"));
    try {
      const querySnapshot = await getDocs(orderedQuery);
      querySnapshot.docs.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    } catch (error) {
      console.error("프로필 업데이트 중 오류가 발생했습니다:", error);
    }
  };
  

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      try {
        await updateProfile(authService.currentUser, {
          displayName: newDisplayName,
        });
        console.log("프로필이 성공적으로 업데이트되었습니다.");
      } catch (error) {
        console.error("프로필 업데이트 중 오류가 발생했습니다:", error);
      }
      refreshUser();
    }
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick} className="logout">Log Out</button>
    </>
  );
};
