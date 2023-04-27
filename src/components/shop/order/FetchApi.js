import axios from "axios";
// import { totalCost } from "../partials/Mixins";
const apiURL = process.env.REACT_APP_API_URL;

// export const getBrainTreeToken = async () => {
//   let uId = JSON.parse(localStorage.getItem("jwt")).user._id;
//   try {
//     let res = await axios.post(`${apiURL}/api/braintree/get-token`, {
//       uId: uId,
//     });
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getRazorpayToken = async () => {
  let uId =JSON.parse(localStorage.getItem("jwt"));
  uId=uId.user._id;
  let totalAmount=0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item)=>{
        totalAmount += item.quantitiy * (item.price-(((parseInt(item.pOffer))*item.price)/100));

  });
  
  // console.log(`Total Amount: ${totalAmount}`);
  try{
    let res = await axios.post(`${apiURL}/api/razorpay/get-token`,{
      uId: uId,
      totalAmount: Math.round(totalAmount),
    });
    
    return res.data;
  }catch(error){
    // console.log("HERE");
    console.log(error);
  }
};

export const getPaymentProcess = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/razorpay/payment`, paymentData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (orderData) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
