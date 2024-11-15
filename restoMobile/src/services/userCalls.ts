import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}login/`;
const baseUrl1 = `${API_URL}user/`;
const baseUrlEmail = `${API_URL}sendEmail/`;
const verifyLink = `${API_URL}register/restoWeb/resend-verification`;
const baseApiUrl = `${API_URL}`;

export const checkIfTokenIsValid = async (body: any) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "GET",
      url: baseUrl + 'restoWeb/checkIn',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the Users:", error);
    throw new Error("Error fetching the Users");
  }
};


export const getPaymentMethodsSubscribe = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: API_URL + 'payments/showPaymentMethodsResto',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching payment methods:", error);
  }
};

export const loginUser = async (userData: any) => {
  try {
    if (baseUrl === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios.post(baseUrl + 'restoWeb', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Error logging in");
  }
};

export const sendRecoveryLinkForRestoUser = async (body: any) => {
  try {
    if (baseUrlEmail === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "POST",
      url: baseUrlEmail + 'userResto/sendPasswordRecovery',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
}

export const registerUser = async (userData: any) => {
  try {
    if (API_URL === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios.post(API_URL + "register/restoWeb", userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error registering user:", error);
    throw new Error("Error registering user");
  }
}

export const addRestoChain = async (token: string, 
  restoChainName: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseApiUrl + 'profile/resto/restoChain',
      params: {key: token},
      data: {
        restoChainName: restoChainName
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
  }
}

export const deleteRestoChain = async (token: string, 
  restoChainName: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseApiUrl + 'profile/resto/restoChain',
      params: {key: token},
      data: {
        restoChainName: restoChainName
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
  }
}

export const checkIfRestoUserExist = async (body: any) => {
  try {
    if (baseUrl1 === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "POST",
      url: baseUrl1 + 'userRestoExist',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking resto user:", error);
    throw new Error("Error checking resto user");
  }
};

export const deleteRestoAccount = async (token: string) => {
  try {
    if (API_URL === undefined) {
      throw new Error("baseUrl is not defined");
    }
    const response = await axios({
      method: "DELETE",
      url: `${API_URL}delete/resto`,
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error deleting the User:", error);
    throw new Error("Error deleting the User");
  }
};

export const addCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: API_URL + 'payments/addCustomerResto',
      data: {
        userToken: token
      },
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error adding Customer:", error);
    throw new Error("Error adding Customer");
  }
};

export const getCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: API_URL + 'payments/getCustomerResto',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
      validateStatus: (status) => {
        return status < 501;
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Customer:", error);
    throw new Error("Error fetching Customer");
  }
};

export const getPaymentMethods = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: API_URL + 'payments/showPaymentMethodsResto',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
      validateStatus: (status) => {
        return status < 500;
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw new Error("Error fetching payment methods");
  }
};

export const deletePaymentMethod = async (paymentID: string) => {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL + 'payments/deletePaymentMethod',
      data: JSON.stringify({
        paymentID: paymentID,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return true;
    } else {
      console.error("Unexpected status code:", response.status);
      throw new Error("Unexpected status code");
    }
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error("Error deleting payment method");
  }
};

export const fetchPaymentSheetParams = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'POST',
      url: API_URL + 'payments/payment-sheet-setup-intent-resto',
      data: JSON.stringify({
        userToken: userToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => {
        return status < 500;
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching payment params:", error);
    throw new Error("Error fetching payment params");
  }
};

export const getStripeKey = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: API_URL + 'payments/stripe-key',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return;
    }

  } catch (error) {
    console.error("Error fetching stripe key:", error);
    throw new Error("Error fetching stripe key");
  }
};

export const verfyTwoFactorAndLogin =
    async (userId: number, code: string, user: any) => {
      try {
        return await axios({
          method: 'POST',
          url: baseUrl + 'restoWeb/TwoFactor',
          data: JSON.stringify({
            id: userId,
            code: code,
            username: user.username,
            password: user.password
          }),
          headers: {
            "content-type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error verifying two factor code:", error);
        return error;
      }
    };

export const resendValidationLink = async (email: string) => {
  try {
    await axios.post(verifyLink, { email });
        
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error with request: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
  }
};