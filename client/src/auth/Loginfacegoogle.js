import React  from 'react'
import { Link  } from 'react-router-dom'
 
import { GoogleLogin } from 'react-google-login';
 
 

const Loginfacegoogle = () => {
 
    const responseGoogle = async (response) => {
      
    }
    

    return (
        <div className="login_page">
            <h2>Login</h2>
        
          
 

                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/forgot_password">Forgot your password?</Link>
                </div>
           
 

            <div className="social">
                <GoogleLogin
                    clientId="Your google client id"
                    buttonText="Login with google"
                    onSuccess={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
 

            </div>
 
        </div>
    )
}

export default Loginfacegoogle 
