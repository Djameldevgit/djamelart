import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { login } from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
 
import Loginfacegoogle from '../auth/Loginfacegoogle'
//import Loginfacegoogle from '../auth/Loginfacegoogle'

const Login = () => {
    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData
    const [typePass, setTypePass] = useState(false)

    const { auth, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const { t } = useTranslation('auth')
    const lang = languageReducer?.language || 'en'
   
    useEffect(() => {
        if (auth.token) history.push("/")
    }, [auth.token, history])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(login(userData))
    }

    return (
        <div className={`auth_page ${lang === "ar" ? "rtl" : ""}`}>


            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">{t('namelogin', { lng: lang })}</h3>
                <div className="form-group">
                    <Loginfacegoogle />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">{t('emailAddress', { lng: lang })}</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email"
                        aria-describedby="emailHelp" onChange={handleChangeInput} value={email} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">{t('password', { lng: lang })}</label>
                    <div className="pass">
                        <input type={typePass ? "text" : "password"}
                            className="form-control" id="exampleInputPassword1"
                            onChange={handleChangeInput} value={password} name="password" />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? t('hide', { lng: lang }) : t('show', { lng: lang })}
                        </small>
                    </div>
                    <div className="form-group">
                        <small>
                            <Link to="/forgot_password" >{t('forgot_password', { lng: lang })}  
                            </Link>
                        </small>

                    </div>
                </div>


                <button type="submit" className="btn btn-dark w-100"
                    disabled={email && password ? false : true}>
                    {t('login', { lng: lang })}
                </button>

                <p className="my-2">
                    {t('dontHaveAccount', { lng: lang })} <Link to="/register" style={{ color: "crimson" }}>
                        {t('registerNow', { lng: lang })}
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login