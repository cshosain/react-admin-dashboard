import Single from "../../components/single/Single";
import { singleProduct } from "../../data";
import "./product.scss";

const Product = () => {
  //fetch the data and send to single component
  //fetch the specific data of a single product by taking id from url and then fetch
  return (
    <div className="product">
      <Single {...singleProduct} />
    </div>
  );
};

export default Product;
