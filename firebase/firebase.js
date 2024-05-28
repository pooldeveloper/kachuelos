import { initializeApp } from "firebase/app";
import firebaseConfig from "./config"
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, addDoc, collection, getDocs, orderBy, doc, getDoc, query, updateDoc, deleteDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class Firebase {
    constructor() {
        const app = initializeApp(firebaseConfig)

        this.auth = getAuth(app)

        this.db = getFirestore(app)

        this.storage = getStorage(app)
    }

    async registrar(nombre, email, password) {
        await createUserWithEmailAndPassword(this.auth, email, password)

        return await updateProfile(this.auth.currentUser, {
            displayName: nombre
        })
    }

    async login(email, password) {
        return await signInWithEmailAndPassword(this.auth, email, password)
    }

    async logout() {
        return await signOut(this.auth)
    }

    async crearColeccion(id, data) {
        return await addDoc(collection(this.db, id), data)
    }

    async subirArchivo(id, archivo) {
        const storageRef = ref(this.storage, id);

        await uploadBytes(storageRef, archivo)

        return await getDownloadURL(storageRef)

    }

    async obtenerColeccion(id) {
        const coleccionRef = collection(this.db, id);

        const q = query(coleccionRef, orderBy('creado', 'desc'));
    
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }

    async obtenerDocumento(idColeccion, idDocumento) {
        const docRef = doc(this.db, idColeccion, idDocumento);

        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            return false
        }

        return await docSnap.data()
    }

    async actualizarDocumento(idColeccion, idDocumento, data){
        const docRef = doc(this.db, idColeccion, idDocumento);
        return await updateDoc(docRef, data);
    }

    async eliminarDocumento(idColeccion, idDocumento){
        const docRef = doc(this.db, idColeccion, idDocumento);
        return await deleteDoc(docRef);
    }
}

const firebase = new Firebase()

export default firebase