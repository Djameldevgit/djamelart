import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { register } from '../redux/actions/authAction'
import { useTranslation } from 'react-i18next'
import valid from '../utils/valid'

const Register = () => {

    const { auth, alert, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const { t } = useTranslation('auth')
    const lang = languageReducer?.language || 'en'

    const initialState = {
        username: '', email: '', password: '', cf_password: ''
    }
    const [userData, setUserData] = useState(initialState)
    const { username, email, password, cf_password } = userData

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    useEffect(() => {
        if (auth.token) history.push("/")
    }, [auth.token, history])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }



    // Dentro del componente Register...

    const handleSubmit = (e) => {
        e.preventDefault()

        const check = valid(userData)
        if (check.errLength > 0) {
            // Traducir cada mensaje con t()
            const translated = {}
            for (const key in check.errMsg) {
                translated[key] = t(check.errMsg[key], { lng: lang })
            }

            return dispatch({ type: 'ALERT', payload: translated })
        }

        dispatch(register(userData))
    }


    return (
        <div className={`auth_page ${lang === "ar" ? "rtl" : ""}`}>
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">{t('nameregister', { lng: lang })}</h3>

                <div className="form-group">
                    <label htmlFor="username">{t('userName', { lng: lang })}</label>
                    <input type="text" className="form-control" id="username" name="username"
                        onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')}
                        style={{ background: `${alert.username ? '#fd2d6a14' : ''}` }} />
                    <small className="form-text text-danger">
                        {alert.username ? t(alert.username, { lng: lang }) : ''}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">{t('emailAddress', { lng: lang })}</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email"
                        onChange={handleChangeInput} value={email}
                        style={{ background: `${alert.email ? '#fd2d6a14' : ''}` }} />
                    <small className="form-text text-danger">
                        {alert.email ? t(alert.email, { lng: lang }) : ''}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">{t('password', { lng: lang })}</label>
                    <div className="pass">
                        <input type={typePass ? "text" : "password"}
                            className="form-control" id="exampleInputPassword1"
                            onChange={handleChangeInput} value={password} name="password"
                            style={{ background: `${alert.password ? '#fd2d6a14' : ''}` }} />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? t('hide', { lng: lang }) : t('show', { lng: lang })}
                        </small>
                    </div>
                    <small className="form-text text-danger">
                        {alert.password ? t(alert.password, { lng: lang }) : ''}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">{t('confirmPassword', { lng: lang })}</label>
                    <div className="pass">
                        <input type={typeCfPass ? "text" : "password"}
                            className="form-control" id="cf_password"
                            onChange={handleChangeInput} value={cf_password} name="cf_password"
                            style={{ background: `${alert.cf_password ? '#fd2d6a14' : ''}` }} />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            {typeCfPass ? t('hide', { lng: lang }) : t('show', { lng: lang })}
                        </small>
                    </div>
                    <small className="form-text text-danger">
                        {alert.cf_password ? t(alert.cf_password, { lng: lang }) : ''}
                    </small>
                </div>

                <button type="submit" className="btn btn-dark w-100">
                    {t('register', { lng: lang })}
                </button>

                <p className="my-2">
                    {t('alreadyHaveAccount', { lng: lang })} <Link to="/login" style={{ color: "crimson" }}>
                        {t('loginNow', { lng: lang })}
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Register