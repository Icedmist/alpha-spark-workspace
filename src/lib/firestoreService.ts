import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task, Directorate, User, MeetingNote } from '../types';
import {
  INITIAL_TASKS,
  INITIAL_DIRECTORATES,
  INITIAL_USERS,
  INITIAL_MEETINGS,
  INITIAL_WORKSPACE,
} from './mockData';

export const FirestoreService = {
  // --- Seed Data into Firestore if collections are empty ---
  async seedInitialFirestoreData() {
    try {
      const taskSnap = await getDocs(collection(db, 'tasks'));
      if (taskSnap.empty) {
        console.log('Seeding initial tasks into Firestore...');
        for (const task of INITIAL_TASKS) {
          await setDoc(doc(db, 'tasks', task.id), task);
        }
      }

      const dirSnap = await getDocs(collection(db, 'directorates'));
      if (dirSnap.empty) {
        for (const dir of INITIAL_DIRECTORATES) {
          await setDoc(doc(db, 'directorates', dir.id), dir);
        }
      }

      const userSnap = await getDocs(collection(db, 'users'));
      if (userSnap.empty) {
        for (const user of INITIAL_USERS) {
          await setDoc(doc(db, 'users', user.id), user);
        }
      }

      const meetingSnap = await getDocs(collection(db, 'meetings'));
      if (meetingSnap.empty) {
        for (const meeting of INITIAL_MEETINGS) {
          await setDoc(doc(db, 'meetings', meeting.id), meeting);
        }
      }

      const wsSnap = await getDocs(collection(db, 'workspaces'));
      if (wsSnap.empty) {
        await setDoc(doc(db, 'workspaces', INITIAL_WORKSPACE.id), INITIAL_WORKSPACE);
      }
    } catch (error) {
      console.warn('Firestore seeding offline fallback active:', error);
    }
  },

  // --- Realtime Subscriptions ---
  subscribeTasks(callback: (tasks: Task[]) => void) {
    return onSnapshot(
      collection(db, 'tasks'),
      (snapshot) => {
        const tasks = snapshot.docs.map((doc) => doc.data() as Task);
        callback(tasks);
      },
      (error) => {
        console.warn('Firestore task subscription fallback:', error);
      }
    );
  },

  subscribeDirectorates(callback: (directorates: Directorate[]) => void) {
    return onSnapshot(
      collection(db, 'directorates'),
      (snapshot) => {
        const dirs = snapshot.docs.map((doc) => doc.data() as Directorate);
        callback(dirs);
      },
      (error) => {
        console.warn('Firestore directorates subscription fallback:', error);
      }
    );
  },

  subscribeUsers(callback: (users: User[]) => void) {
    return onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data() as User);
        callback(users);
      },
      (error) => {
        console.warn('Firestore users subscription fallback:', error);
      }
    );
  },

  subscribeMeetings(callback: (meetings: MeetingNote[]) => void) {
    return onSnapshot(
      collection(db, 'meetings'),
      (snapshot) => {
        const meetings = snapshot.docs.map((doc) => doc.data() as MeetingNote);
        callback(meetings);
      },
      (error) => {
        console.warn('Firestore meetings subscription fallback:', error);
      }
    );
  },

  // --- CRUD Functions ---
  async saveTask(task: Task): Promise<void> {
    try {
      await setDoc(doc(db, 'tasks', task.id), task, { merge: true });
    } catch (e) {
      console.error('Error saving task to Firestore:', e);
    }
  },

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Error updating task status in Firestore:', e);
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (e) {
      console.error('Error deleting task in Firestore:', e);
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
    } catch (e) {
      console.error('Error saving user to Firestore:', e);
    }
  },

  async saveMeeting(meeting: MeetingNote): Promise<void> {
    try {
      await setDoc(doc(db, 'meetings', meeting.id), meeting, { merge: true });
    } catch (e) {
      console.error('Error saving meeting to Firestore:', e);
    }
  },
};
