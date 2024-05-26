import { initializeApp } from "firebase/app";
import firebaseConfig from "./config"
import { createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, orderBy } from "firebase/firestore"
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

    async crearDocumento(id, data) {
        return await addDoc(collection(this.db, id), data)
    }

    async subirArchivo(id, archivo){
        const referencia = ref(this.storage, id);

        await uploadBytes(referencia, archivo)

        return await getDownloadURL(referencia)

    }

    async obtenerDocumento(id){
        const querySnapshot = await getDocs(collection(this.db, 'kachuelos'), orderBy('creado', 'desc'))

        return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    }
}   

const firebase = new Firebase()

export default firebase