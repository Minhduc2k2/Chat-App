import { useState } from "react";
import { useEffect, useRef } from "react";
import { projectFirestore } from "../firebase/config";

function useCollection(collection, _query) {
  const [document, setDocument] = useState(null);

  //! If we don't use useRef --> infinite loop in useEffect
  //! _query is an array and is "different" on every fuction call
  const query = useRef(_query).current;

  useEffect(() => {
    let ref = projectFirestore.collection(collection).orderBy("createdAt");

    //TODO: Only get document where uid == user.uid
    if (query) {
      ref = ref.where(...query);
    }
    const unsub = ref.onSnapshot(
      (snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });

        setDocument(result);
      },
      (error) => {
        console.log(error.message);
      }
    );
    return () => unsub();
  }, [collection, query]);
  return { document };
}

export { useCollection };
