// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-900 py-6 z-50">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Chandra SK Nadendla. All rights reserved.</p>
      </div>
    </footer>
  );
}
