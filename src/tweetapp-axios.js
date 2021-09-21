import axios from 'axios';

const tweetappAxios = axios.create();

tweetappAxios.defaults.baseURL = "http://localhost:8080/api/v1.0/tweets"

tweetappAxios.interceptors.response.use(undefined, error => {
    console.log('Invoking interceptor...', error);
    if(error.response.status === 401){
        alert('Your session has expired. Redirecting to login page...');
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        window.location.replace("/login");
    }else{
        return Promise.reject(error);
    }
});

export default tweetappAxios;