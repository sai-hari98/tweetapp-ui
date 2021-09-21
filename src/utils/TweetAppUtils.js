export const getInputFieldStyle = () => {
    return {
        style: {
            'fontFamily': `'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
        }
    }
}

export const getButtonStyle = () => {
    return {
        'fontFamily': `'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        'color': '#ffffff',
        'backgroundColor': '#344955',
        'outline': 'none'
    }
}

export const initFormField = (validations) => {
    return {
        value: '',
        validations: validations,
        valid: false,
        dirty: false,
        focus: false
    }
}

export const validateFormField = (value, validations) => {
    let valid = true;
    for (let validation of validations) {
        if (validation.type === 'min') {
            valid = valid && value.trim().length >= validation.value;
        }
        if (validation.type === 'max') {
            valid = valid && value.trim().length <= validation.value;
        }
        if (validation.type === 'phno') {
            valid = valid && !isNaN(value) && value.trim().length === 10;
        }
        if (validation.type === 'email') {
            let pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
            valid = valid && pattern.test(value);
        }
        if (validation.type === 'nospace') {
            valid = valid && value.indexOf(' ') <= 0;
        }
    }
    return valid;
}

export const checkFieldInvalid = (form, field) => {
    return !form[field].valid && form[field].dirty && !form[field].focus;
}

export const getHelperText = (state, field, msg) => {
    let finalMsg = ' ';
    if (checkFieldInvalid(state, field)) {
        finalMsg = msg;
    }
    return finalMsg;
}

export const checkFormValid = (form) => {
    let valid = true;
    for (let key of Object.keys(form)) {
        valid = valid && form[key].valid;
    }
    return valid;
}

export const getErrorResponseMsg = (error, defaultMsg, ...expectedCds) => {
    let message = defaultMsg;
    let normalExpCdArr = Array.from(expectedCds)
    if (error.response !== undefined && error.response !== null
        && error.response.data !== undefined && error.response.data !== null) {
        let code = error.response.data.code;
        if (code != undefined && code != null && normalExpCdArr.some(expectedCd => expectedCd === code)) {
            message = error.response.data.message;
        }
    }
    return message;
}

export const getCookieVals = () => {
    let cookieVals = [];
    if (document.cookie !== undefined && document.cookie !== null
            && document.cookie !== '') {
        console.log(document.cookie);
        let jwt = '';
        let username = '';
        let cookies = document.cookie.split(", ");
        cookies.forEach(cookie => {
            let keyVal = cookie.split("=");
            if (keyVal[0] == 'jwt') {
                jwt = keyVal[1];
            }
            if (keyVal[0] == 'username') {
                username = keyVal[1];
            }
        });
        cookieVals.push(jwt, username);
    }
    console.log("Cookies",cookieVals);
    return cookieVals;
}

export const createJwtHeader = (auth) => {
    let config = {
        headers: {
            'Authorization': `Bearer ${auth}`
        }
    };
    return config;
}