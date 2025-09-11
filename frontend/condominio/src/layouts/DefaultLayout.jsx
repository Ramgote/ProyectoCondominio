import Footer from "../components/footer/footer";
import Header from "../components/header/Header";
import Main from "../components/main/main";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default DefaultLayout;