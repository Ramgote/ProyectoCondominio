import Footer from "./Footer";
import Header from "./Header";

const DefaultLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;