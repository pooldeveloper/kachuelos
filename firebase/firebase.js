import { initializeApp } from "firebase/app";
import firebaseConfig from "./config"
import { createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, orderBy, doc, getDoc } from "firebase/firestore"
import { getStorage, getDownloadURL, uploadBytes, ref } from "firebase/storage";

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

        return await getDownloadURL(referencia)

    }

    async obtenerColeccion(id) {
        const querySnapshot = await getDocs(collection(this.db, id), orderBy('creado', 'desc'))

        return await querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    }

    async obtenerDocumento(idColeccion, idDocumento) {
        const docRef = doc(this.db, idColeccion, idDocumento);

        const docSnap = await getDoc(docRef);

        return await docSnap.data()
    }
}

const firebase = new Firebase()

export default firebase