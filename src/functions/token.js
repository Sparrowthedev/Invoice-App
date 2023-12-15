function parseJwt(token) {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Error parsing JWT", error);
        return null;
    }
}

// expiresIn

function isTokenExpired(token) {
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
        return true; // Token is invalid or can't be parsed
    }
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    return decodedToken.exp < currentTime;
}

export const checkTokenAndRedirect = (navigate) => {
    let token;
    const localToken = localStorage.getItem('token');
    token = localToken ? localToken : '';
    if (token === '') {
        // Token is not present or is expired
        // Redirect to login page
        navigate('/login') // Adjust the path as needed
    }else if(isTokenExpired(token)){
        navigate('/login') // Adjust the path as needed
    }
}

