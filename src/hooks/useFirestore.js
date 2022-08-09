import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';


const useFirestore = (name, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef;
        // Condition
        /**
         * {
         *  fieldName: 'name',
         *  operator: '==',
         *  value: 'abc'
         * }
         */
        if (condition) {
            if (!condition.value) {
                return;
            }

            collectionRef = query(
                collection(db, name),
                orderBy('createdAt'),
                where(condition.fieldName, condition.operator, condition.value)
            );
        }
        const unsubscribe = onSnapshot(
            collectionRef,
            (snapshot) => {
                const documents = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }))

                setDocuments(documents);
            })

        return unsubscribe;
    }, [name, condition]);

    return documents;
}

export default useFirestore;
