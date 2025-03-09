import { Switch, Route } from "react-router-dom";
import Template from "./template/Template";
import ProductDetail from "./products/detail/ProductDetail";
import Profile from "./profile/Profile";
import Landing from "./products/Landing";
import CheckoutDetail from "./transaction/CheckoutDetail";
import OrderList from "./orderData/OrderList";
import ProductList from "./products/ProductList";
import { CartProvider } from "./context/CartContext"; // Import CartProvider

function App() {
  return (
    <CartProvider> {/* Bungkus seluruh aplikasi dengan CartProvider */}
      <Template>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/products" exact component={ProductList} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/orderList" component={OrderList} />
          <Route path="/checkoutDetail" component={CheckoutDetail} />


        </Switch>
      </Template>
    </CartProvider>
  );
}

export default App;
