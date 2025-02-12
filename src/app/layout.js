import "./globals.css";
export const metadata = {
  title: "PAS Admin",
  description: "PAS admin app",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts and load additional fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
