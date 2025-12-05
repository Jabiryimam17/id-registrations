import '../output.css';

export const metadata = {
  title: 'Registration Page',
  description: 'Election Registration',
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>{children}</body>
      </html>
  );
}