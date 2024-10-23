import axios from "axios";
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}login/`;
const baseUrl1 = `${API_URL}user/`;
const baseUrlEmail = `${API_URL}sendEmail/`;
const verifyLink = `${API_URL}register/resend-verification`;

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(baseUrl, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return {status: response.status, data: response.data};
  } catch (error) {
    if (error.response.status === 403 || error.response.status === 404) {
      return {status: error.response.status, data: error.response.data};
    } else {
      console.error("Error logging in:", error);
      throw new Error("Network error or other issue");
    }
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(API_URL + "register", userData, {
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

export const sendRecoveryLinkForVisitorUser = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrlEmail + 'userVisitor/sendPasswordRecovery',
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

export const checkIfVisitorUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl1 + 'userVisitorExist',
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
};

export const deleteAccount = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: `${API_URL}delete/`,
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

export const getUserAllergens = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: API_URL + 'user/allergens/get',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching the User allergens:", error);
    throw new Error("Error fetching the User allergens");
  }
};

export const getUserDislikedIngredients = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: API_URL + 'user/dislikedIngredients/get',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching the User disliked ingredients:", error);
  }
};



export const addCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: API_URL + 'payments/addCustomerVisitor',
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
      url: API_URL + 'payments/getCustomerVisitor',
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
    console.error("Error fetching Customer:", error);
    throw new Error("Error fetching Customer");
  }
};

export const getPaymentMethods = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: API_URL + 'payments/showPaymentMethodsVisitor',
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
      url: API_URL + 'payments/payment-sheet-setup-intent-visitor',
      data: JSON.stringify({
        userToken: userToken,
      }),
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
