export const LoginSession = (key) => {
    localStorage.setItem("session", key);
};

export const LogoutSession = () => {
    localStorage.removeItem("session");
};
  
export const GetAuthConfig = () => {
    return {
        headers: { 
            Authorization: localStorage.getItem("session") ?? "",
        },
    };
};
