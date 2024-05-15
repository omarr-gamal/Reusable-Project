export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    mainWalletAmount: number;
    savingWalletAmount: number;
    joinedAt?: string;
}

export const defaultUser: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg', 
    mainWalletAmount: 0,
    savingWalletAmount: 0,
    joinedAt: (new Date()).toLocaleString()
};