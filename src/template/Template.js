import { checkAuth } from "../utils/auth";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import { Redirect } from "react-router-dom"; // Redirect jika tidak login

function Template(props) {
  if (!checkAuth()) {
    // return <Redirect to="/login" />; // Arahkan ke halaman login jika belum login
  }

  return (
    <>
      <Header />
      <Content>{props.children}</Content>
      <Footer />
    </>
  );
}

export default Template;
