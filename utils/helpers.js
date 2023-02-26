module.exports = {
    // Format date as MM/DD/YYYY
    dateFormat: (date) => {
        return date.toLocaleDateString();
    },
    
    validateEmail: (email) => {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email)
    }
};