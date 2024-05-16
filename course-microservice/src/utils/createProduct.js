// import axios
import axios from "axios";
import { getAPIUrl } from "./utils/getAPIUrl";

// function that makes an api call to payments microservice to create a product
export async function createProduct(name, price, description) {
  try {
    const response = await axios.post(
      `http://${getAPIUrl()}:${
        process.env.PAYMENT_PORT
      }/api/payments/create-product`,
      { name, price, description }
    );
    return response.data.price.id;
  } catch (error) {
    throw new Error("Product creation failed");
  }
}
