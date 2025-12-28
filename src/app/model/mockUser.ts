export interface MockUser {
  id: string;
  username: string;
  email: string;
  photoUrl: string;
  welcomeMessage: string;
  role: 'support' | 'customer';
}