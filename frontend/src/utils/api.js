
const BASE_URL=import.meta.env.VITE_API_URL 

// --- API HELPERS ---
// 1. Register
export const registerUser = async (username, email, password) => {
  const response = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to register user");
  }

  // Return user info + tokens for localStorage
  return data; // { message, user_id, username, access_token, refresh_token }
};


//2. Login
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to login user");

  // Save full user object in localStorage
  const userData = {
    user_id: data.user_id,
    username: data.username,
    access_token: data.access_token
  };
  localStorage.setItem("user", JSON.stringify(userData));

  return userData; // return full user info
};


//3. Logout
export const logoutUser = () => {
  // Clear the stored user info
  localStorage.removeItem("user");
  return { message: "Logout successful" };
};

//4. Reset password email
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${BASE_URL}/api/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to send reset email");
  }

  return data.message; // "Password reset email sent!"
};

//5. Submit new password using token
export const submitNewPassword = async (token, password) => {
  const response = await fetch(`${BASE_URL}/api/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to reset password");
  }

  return data.message; // "Password updated successfully"
};

//6. Get Tasks
export const fetchTasks = async () => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const access_token = savedUser?.access_token;

  if (!access_token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`
    }
  });

  if (response.status === 401) {// token invalid/expired
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to fetch tasks");

  return data;
};//data is an array of objects with tasks inside.


//7. Add Task
export const addTask = async(task) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const access_token = savedUser?.access_token;
  console.log("Sending token:", access_token);
  
  let headers = { "Content-Type": "application/json" };
  if (access_token) headers["Authorization"] = `Bearer ${access_token}`;
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method:"POST",
    headers,
    body:JSON.stringify(task)
  });

  if (response.status === 401) {// token invalid/expired
    throw new Error("Session expired. Please log in again.");
  }
  
  const data = await response.json()
  if (!response.ok){
    throw new Error(data.error || "Failed to add task");
  }
  return data;
};

//8. Toggle Task Completed

export const toggleTaskCompleted = async (taskId, isCompleted) => {
  const savedUser=JSON.parse(localStorage.getItem("user"));//Converts JSON string from localStorage into js object.
  const access_token=savedUser?.access_token;

  if (!access_token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/api/tasks/${taskId}/complete`,{
    method:"PATCH",
    headers:{
       "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
    body: JSON.stringify({isCompleted}),//Converts js object into JSON string.Used when sending data to the server in fetch requests.
  });

  if(response.status ===401) {
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();//reads the HTTP response body(JSON string) and converts it into js object.
  if(!response.ok) {
    throw new Error(data.error || "Failed to update tasl completion status")
  }

  return data;
}

//9. Delete Task
export const deleteTask = async (task_id) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const access_token = savedUser?.access_token;

  if (!access_token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/api/tasks/${task_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
  });

  if (response.status === 401) {// token invalid/expired
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to delete task");

  return data;
};

//TO BE IMPLEMENTED- 
// --- Update Task ---
export const updateTask = async (id, updatedTask) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const access_token = savedUser?.access_token;

  if (!access_token) throw new Error("No access token found");

  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
    body: JSON.stringify(updatedTask),
  });

  if (response.status === 401) {// token invalid/expired
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to update task");
  }

  return data;
};