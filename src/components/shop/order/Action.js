import { Razorpay } from "razorpay-checkout";
import { createOrder, getRazorpayToken } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

/*-------------------------------------------------------------
-----------------For Razorpay---------------------------------
---------------------------------------------------------------    */

export const fetchRazorpay = async (getrazorpayToken, setState) => {
  try {
    let responseData = await getRazorpayToken();

    if (responseData && responseData) {
      setState({
        clientToken: responseData.id,
        success: responseData.success,
      });
      // console.log(responseData);

    }
  } catch (error) {
    console.log(error);
  }
};




/*-------------------------------------------------------------
-----------------For Braintree---------------------------------
---------------------------------------------------------------    */

// export const fetchbrainTree = async (getBrainTreeToken, setState) => {
//   try {
//     let responseData = await getBrainTreeToken();
//     if (responseData && responseData) {
//       setState({
//         clientToken: responseData.clientToken,
//         success: responseData.success,
//       });
//       console.log(responseData);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  console.log(totalCost);
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    // dispatch({ type: "loading", payload: true });
    // console.log(state.clientToken);
    let options = {
      key: `${process.env.REACT_APP_RAZORPAY_KEY}`,
      amountTotal: Math.round(totalCost()) * 100,
      currency: 'INR',
      name: `Health Cart`,
      description: `Transaction for purchase on Health Cart`,
      // image:`${process.env.myLogo}`,
      order_id: `${state.clientToken}`,
      handler: function (response) {
        // console.log(response);
        getPaymentProcess({
          amountTotal: totalCost() * 100,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        }).then(async (res) => {
          let orderData = {
            allProduct: JSON.parse(localStorage.getItem("cart")),
            user: JSON.parse(localStorage.getItem("jwt")).user._id,
            amount: res.amountTotal,
            transactionId: res.paymentId,
            address: state.address,
            phone: state.phone,
          };
          try {
            let resposeData = await createOrder(orderData);
            if (resposeData.success) {
              localStorage.setItem("cart", JSON.stringify([]));
              dispatch({ type: "cartProduct", payload: null });
              dispatch({ type: "cartTotalCost", payload: null });
              dispatch({ type: "orderSuccess", payload: true });
              setState({ clientToken: "", instance: {} });
              dispatch({ type: "loading", payload: false });
              return history.push("/");
            } else if (resposeData.error) {
              console.log(resposeData.error);
            }
          } catch (error) {
            console.log(error);
          }

        }).catch((error) => {
          console.log(error);
          return history.push("/checkout");
        });
      },
      prefill: {
        contact: `${state.contact}`,
      },
      notes: {
        userId: `${state.userId}`,
        address: `The Golden Deals Faridabad`
      },
      theme: {
        color: "#F37254",
      },
    }
    const razorpay = new window.Razorpay(options);
    razorpay.open();



    // let nonce;
    // state.instance
    //   .requestPaymentMethod()
    //   .then((data) => {
    //     dispatch({ type: "loading", payload: true });
    //     nonce = data.nonce;
    //     let paymentData = {
    //       amountTotal: totalCost(),
    //       paymentMethod: nonce,
    //     };
    //     getPaymentProcess(paymentData)
    //       .then(async (res) => {
    //         if (res) {
    //           let orderData = {
    //             allProduct: JSON.parse(localStorage.getItem("cart")),
    //             user: JSON.parse(localStorage.getItem("jwt")).user._id,
    //             amount: res.transaction.amount,
    //             transactionId: res.transaction.id,
    //             address: state.address,
    //             phone: state.phone,
    //           };
    //           try {
    //             let resposeData = await createOrder(orderData);
    //             if (resposeData.success) {
    //               localStorage.setItem("cart", JSON.stringify([]));
    //               dispatch({ type: "cartProduct", payload: null });
    //               dispatch({ type: "cartTotalCost", payload: null });
    //               dispatch({ type: "orderSuccess", payload: true });
    //               setState({ clientToken: "", instance: {} });
    //               dispatch({ type: "loading", payload: false });
    //               return history.push("/");
    //             } else if (resposeData.error) {
    //               console.log(resposeData.error);
    //             }
    //           } catch (error) {
    //             console.log(error);
    //           }
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setState({ ...state, error: error.message });
    //   });
  }
};
