import firebase from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import SecureStorage from './store';


class AuthService {
    async signupUser(name: string, email: string, password: string) {
        const { auth, db } = firebase;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                createdAt: new Date(),
            });

            return { success: true, user: user };
        } catch (error: any) {
            let errorMessage = 'An error occurred during signup. Please try again later.';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use. Please choose a different email.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'The email address is invalid. Please enter a valid email.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'The password is too weak. Please choose a stronger password.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    };
    async loginUser(email: string, password: string) {
        const { auth } = firebase;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await SecureStorage.saveData('user', userCredential.user.uid);
            return { success: true, user: userCredential.user };
        } catch (error: any) {
            let errorMessage = 'An error occurred during login. Please try again later.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please sign up first.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            }  else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid Credentials. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'The email address is invalid. Please enter a valid email.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage };
        }
    }
}
export default new AuthService();
