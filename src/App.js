import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useState, useEffect} from 'react';
import Button from './components/Button';
import Channel from './components/Channel';
import Message from './components/Message';

firebase.initializeApp({
    apiKey: "AIzaSyD7SZiPrRGIS7hNnh54sKi-pMxBodfvYoQ",
    authDomain: "firechat-9b4b9.firebaseapp.com",
    projectId: "firechat-9b4b9",
    storageBucket: "firechat-9b4b9.appspot.com",
    messagingSenderId: "310671922180",
    appId: "1:310671922180:web:eb3faf72c404236f19d151"
  
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if(initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [])

  const signInWithGoogle = async () => {
    
    // Retrieve Google provider object
    const provider = new firebase.auth.GoogleAuthProvider();

    // Set language to the default browser preference
    auth.useDeviceLanguage();

    // Start sign in process
    try {
      await auth.signInWithPopup(provider);
    } catch(error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try{
      await firebase.auth().signOut();
    } catch(error) {
      console.log(error.message);
    }
  }

  if(initializing) return "Loading..."

  return (
    <div> 
      {user ? (
        <>
        <Button onClick={signOut}>Sign out</Button>
         <Channel user={user} db={db} />
        </>
       
      ) : (
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      )}
      
    </div>
  );
}

export default App;
