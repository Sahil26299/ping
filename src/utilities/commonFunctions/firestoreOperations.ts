import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GenericObjectInterface } from "../commonInterface/commonInterfaces";
import { firebaseCollections } from "../apiconfig/apiConfig";

/**
 * Perform firebase update operation here. To update any existing data in the firestore database.
 * @param key - collection name in the firestore database,
 * @param data - data to be updated in the firestore database (payload),
 * @param args - path parameters to be passed to the firestore database,
 * @returns - returns true if the operation is successful,
 */
export const firestoreUpdateOperation = async (
  key: string,
  data: GenericObjectInterface,
  [...args]: any[]
) => {
  try {
    const userDocRef = doc(db, key, ...args);
    await updateDoc(userDocRef, data);
    return true;
  } catch (error) {}
};

/**
 * Perform firebase set operation here. To set any new / overrite existing data in the firestore database.
 * @param key - collection name in the firestore database,
 * @param data - data to be updated in the firestore database (payload),
 * @param args - path parameters to be passed to the firestore database,
 * @returns - returns true if the operation is successful,
 */
export const firestoreSetOperation = async (
  key: string,
  data: GenericObjectInterface,
  [...args]: any[]
) => {
  try {
    const userDocRef = doc(db, key, ...args);
    await setDoc(userDocRef, data);
    return true;
  } catch (error) {}
};

/**
 * @param key - collection name or path in the firestore database,
 * @param args - (Odd, 1, 3, 5 etc) path parameters to be passed to the firestore database,
 * @returns - returns true if the operation is successful,
 */
export const firestoreGetCollectionOperation = async (
  key: string,
  ...args: any[]
) => {
  try {
    const collectionRef = collection(db, key, ...args);
    const q = query(collectionRef);
    const docs = await getDocs(q);
    const result: GenericObjectInterface[] = docs.docs.map((doc) => doc.data());
    return result;
  } catch (error) {}
};

/**
 * Function to refer a doc in firestore
 * @param key - collection name or path in the firestore database,
 * @param args - (Odd, 1, 3, 5 etc) path parameters to be passed to the firestore database,
 * @returns - returns true if the operation is successful,
 */
export const firestoreReferDocOperation = (key: string, ...args: any[]) => {
  return doc(db, key, ...args);
};

export const listenToChats = (userId: string, callback: Function) => {
  const chatsRef = collection(
    db,
    `${firebaseCollections.USERS}/${userId}/${firebaseCollections.CHATS}`
  );
  const q = query(chatsRef);

  return onSnapshot(q, (snapshot) => {
    console.log(snapshot.docs, "snapshot.docs");

    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
};

/**
 * Parse firebase date object into javascript date object
 * @param timestamp
 * @returns
 */
export function convertFirestoreTimestamp(timestamp: any): Date | string {
  if (!timestamp) return "";
  if (timestamp.toDate) return timestamp.toDate(); // Firestore native object
  if (timestamp.seconds)
    return new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000
    );
  return new Date(timestamp); // fallback
}

/**
 * Resolve a single user reference from Firestore
 */
export const resolveUserReference = async (
  userRef: any
): Promise<GenericObjectInterface | null> => {
  try {
    if (!userRef?.path) return null;
    const userDocRef = firestoreReferDocOperation(userRef.path);
    const userDoc = await getDoc(userDocRef);
    return userDoc?.exists()
      ? (userDoc.data() as GenericObjectInterface)
      : null;
  } catch (error) {
    console.error("Error resolving user reference:", error);
    return null;
  }
};

/**
 * Resolve all user references in a chat
 */
export const resolveChatUsers = async (
  userRefs: any[]
): Promise<GenericObjectInterface[]> => {
  const resolvedUsers = await Promise.all(userRefs.map(resolveUserReference));
  return resolvedUsers.filter(Boolean) as GenericObjectInterface[];
};

/**
 * Resolve last message sender reference
 */
export const resolveLastMessageSender = async (
  lastMessage: GenericObjectInterface | undefined
): Promise<GenericObjectInterface | null> => {
  try {
    if (!lastMessage?.sender?.path) return null;
    const senderRef = firestoreReferDocOperation(lastMessage.sender.path);
    const senderDoc = await getDoc(senderRef);
    return senderDoc.exists()
      ? (senderDoc.data() as GenericObjectInterface)
      : null;
  } catch (error) {
    console.error("Error resolving last message sender:", error);
    return null;
  }
};
