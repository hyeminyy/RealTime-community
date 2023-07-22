import React, { useEffect, useState } from "react";
import { dbService,dbAddDoc,dbCollection } from "fBase";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    } from "firebase/firestore";
    import { ref, uploadString } from "@firebase/storage";
    import Tweet from "components/Tweet";
    import "./Home.css";
  

const Home = ({userObj}) => {
    console.log(userObj);
    const [tweet, setTweet] = useState(""); 
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        const q = query(
        collection(dbService, "tweets"),
        orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
        const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));
        setTweets(tweetArr);
        });
        }, []);

        const onSubmit = async (event) => {
            event.preventDefault();
            if (!tweet) {
              return; // 트윗 내용이 비어있으면 함수 종료
            }
            try {
              const docRef = await addDoc(collection(dbService, "tweets"), {
                text: tweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
              });
              setTweet("");
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          };

            const onChange = (event) => {
            const {
            target: { value },
            } = event;
            setTweet(value);
            };
            const onFileChange = (event) => {
                const {
                    target: {files},
                } = event;
                const theFile = files[0]; 
                const reader = new FileReader();
                reader.onloadend = (finishedEveent) => {
                    const {currentTarget : {result},
                } = finishedEveent;
                    setAttachment(result);
                };
                reader.readAsDataURL(theFile);
            };
            const onClearAttachment = () => setAttachment(null);
          
            return (
                <div className="tweetContainer">
                  <form onSubmit={onSubmit} className="tweetForm">
                    <input
                      value={tweet}
                      onChange={onChange}
                      type="text"
                      placeholder="Feel free to talk!"
                      maxLength={120}
                    />
                    <input type="submit" value="Tweet" />
                  </form>
                  <div className="tweetList">
                    {tweets.map((tweet) => (
                      <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                    ))}
                  </div>
                </div>
              );
              
};
export default Home;