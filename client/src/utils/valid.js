 
  
    const valid = ({ username, email, password, cf_password }) => {
      const err = {}
    
      if (!username) {
        err.username = 'validation.username.required'
      } else if (username.replace(/ /g, '').length > 25) {
        err.username = 'validation.username.length'
      }
  
      if (!email) {
        err.email = 'validation.email.required'
      } else if (!validateEmail(email)) {
        err.email = 'validation.email.format'
      }
      if (!password) {
        err.password = 'validation.password.required'
      } else if (password.length < 6) {
        err.password = 'validation.password.length'
      }
    
      if (password !== cf_password) {
        err.cf_password = 'validation.cf_password.mismatch'
      }
    
  
    return {
      errMsg: err,
      errLength: Object.keys(err).length,
    }
  }
  
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  
  export default valid
  