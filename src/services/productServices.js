import AsyncStorage from "@react-native-async-storage/async-storage";
import { addEmpLeave, getEmpLeavedata, addClaim, getEmpClaimdata, getExpenseItemList, getProjectList, getEmpAttendanceData, getEmpHolidayData, empCheckData, processClaim, getClaimApproverList, userLoginURL, setUserPinURL, getCustomerDetailListURL, OrderListURL, addCustomerTicketURL,   } from "../services/ConstantServies";
import { authAxios, authAxiosFilePost, authAxiosPost, authAxiosPosts } from "./HttpMethod";

export function getEmpLeave(leave_type , emp_id, year) {
    let data = {};
    if (leave_type ){
        data['leave_type '] = leave_type;
    }
    if (emp_id){
        data['emp_id'] = emp_id;
    }
    if (year){
        data['year'] = year;
    }
  
    // console.log('getUserTasks', task_type, userTaskListURL, data)
    return authAxios(getEmpLeavedata, data)
  }
  
  export function postEmpLeave(leave_type) {
    let data = {};
    if (leave_type) {
      data['leave_data'] = leave_type;
    }
    // console.log('Data to be sent:', data);
    return authAxiosPost(addEmpLeave, data)
  
  }

  export function postClaim(claim_data) {
    let data = {};
    if (claim_data) {
      data = claim_data;
    }
    // console.log('Data to be sent:', claim_data);
    return authAxiosFilePost(addClaim, claim_data)
  }

  export function postClaimAction(claim_type) {
    let data = {};
    if (claim_type) {
      data['claim_data'] = claim_type;
    }
    // console.log('Data to be sent:', data);
    return authAxiosPost(processClaim, data)
  
  }

  export function getClaimApprover() { 
    let data = {};
    return authAxios(getClaimApproverList)
  }

  export function getEmpClaim(res) {
    let data = {
      'call_mode':res
    };
    
    // console.log(res)
    return authAxios(getEmpClaimdata, data)
  }

  export function getExpenseItem() { 
    return authAxios(getExpenseItemList)
  }

  export function getExpenseProjectList() { 
    return authAxios(getProjectList)
  }

  export function getEmpAttendance(res) {
    let data = {
      'emp_id':res.emp_id,
      'month':res.month,
      'year': res.year
    };
    // console.log('Final response data',data)
    return authAxios(getEmpAttendanceData, data)
  }

  export function getEmpHoliday(res) {
    let data = {
      'year': res.year
    };
    // console.log(data,'Final response data')
    return authAxios(getEmpHolidayData, data)
  }

  export function postCheckIn(checkin_data) {
    let data = {};
    if (checkin_data) {
      data['attendance_data'] = checkin_data;
      // data = checkin_data;
    }
    // console.log('Data to be sent:', data);
    return authAxiosPost(empCheckData, data)
  }

    //Customer Login
export async function customerLogin(payload) {
  const url = await userLoginURL(); 
  let data = payload;
  return authAxiosPosts(url, data);
}

export async function setUserPinView(o_pin, n_pin) {
  const url = await setUserPinURL();
  try {
    const customerId = await AsyncStorage.getItem("Customer_id");
    let customerIdNumber = parseInt(customerId, 10);

    if (isNaN(customerIdNumber)) {
      throw new Error("Invalid Customer ID: " + customerId);
    }

    const effectiveCustomerId = customerIdNumber;

    let data = {
      u_id: effectiveCustomerId,
      o_pin: o_pin,
      n_pin: n_pin,
      user_type: "CUSTOMER",
    };

    // console.log("Sending request to API with data:", data);
    const response = await authAxiosPost(url, data);
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error in setUserPinView:", error.response ? error.response.data : error.message);
    throw error;
  }
} 
// TO fetch the Customer details 
export async function customerDetail(customerId) {
  try {
    const url = await getCustomerDetailListURL();
    const data = { customer_id: customerId };
    return authAxios(url, data);
  } catch (error) {
    console.error('Error in customerDetail:', error);
    throw error;
  }
}
//To fetch the order details from the customer
export async function order_list(customer_id) {
  const url = await  OrderListURL(); 
  let data = {};
  if (customer_id){
    data['customer_id']=customer_id
  }
  return authAxios(url,data);
}
export async function customerTicket(payload) {
  const url = await  addCustomerTicketURL(); 
  let data = payload;
  return authAxiosPosts(url, data);
}

export async function submitCustomerTicket(formData) {
    try {
        const url = await addCustomerTicketURL();
        if (!url) {
            throw new Error('Failed to get ticket submission URL');
        }
        // Use authAxiosFilePost for sending FormData
        const response = await authAxiosFilePost(url, formData);
        if (!response || !response.data) {
            // Handle cases where the response data might be empty but the status is ok
             if (response && response.status >= 200 && response.status < 300) {
                 return { data: { success: true, message: "Ticket submitted successfully (no data in response)" } };
             } else {
                throw new Error('No data or unexpected response received from ticket submission API');
             }
        }
         // Assuming the backend sends a success flag
        if (response.data.success === false && response.data.message) {
             throw new Error(response.data.message);
        }
        return response;
    } catch (error) {
        console.error('Error in submitCustomerTicket:', error.response?.data || error.message);
        // Propagate the error with a user-friendly message
        const userMessage = error.response?.data?.message || error.message || 'Failed to submit ticket';
        throw new Error(userMessage);
    }
}
