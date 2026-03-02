import { redirect } from 'next/navigation';

export default function Home() {
  // Doğrudan kullanıcı ana sayfasına yönlendir
  redirect('/home');
}
