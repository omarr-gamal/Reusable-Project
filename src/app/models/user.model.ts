export interface User {
    uid: string;
    email: string;
    name: string;
    age: number;
    gender: string;
    photoURL: string;
    joinedAt: string;
}

export const defaultUser: User = {
    uid: '',
    email: '',
    name: '',
    photoURL: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 
    age: 1,
    gender: '',
    joinedAt: (new Date()).toLocaleString()
};
