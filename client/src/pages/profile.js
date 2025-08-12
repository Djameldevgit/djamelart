import React, { useEffect, useState } from 'react'
import Info from '../components/profile/Info'
import Posts from '../components/profile/Posts'
import Saved from '../components/profile/Saved'
import { useSelector, useDispatch } from 'react-redux'
import LoadIcon from '../images/loading.gif'
import { getProfileUsers } from '../redux/actions/profileAction'
import { useParams } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useTranslation } from 'react-i18next'
import ActivateButton from '../components/ActivateButton'

const Profile = () => {
    const { profile, auth, languageReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)
    const { t } = useTranslation(['profile', 'common'])
    const lang = languageReducer?.language || 'en'

    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUsers({id, auth}))
        }
    },[id, auth, dispatch, profile.ids])

    return (
        <div>
            <Nav variant="pills" activeKey="1">
                
                <Nav.Item>
                    <Nav.Link eventKey="2" title="Item">
                        {t('common:navLink2', { lng: lang })}
                    </Nav.Link>
                </Nav.Item>
                <NavDropdown title={t('common:dropdown', { lng: lang })} id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.1">{t('common:action', { lng: lang })}</NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.2">{t('common:anotherAction', { lng: lang })}</NavDropdown.Item>
                </NavDropdown>
            </Nav>

            <div className="profile">
                <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

                {auth.user._id === id && (
                    <div className="profile_tab">
                        <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}>
                            {t('posts', { lng: lang })}
                        </button>
                        <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}>
                            {t('saved', { lng: lang })}
                        </button>
                    </div>
                )}

                {profile.loading ? (
                    <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
                ) : (
                    saveTab ? <Saved auth={auth} dispatch={dispatch} /> : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                )}
            </div>
        </div>
    )
}

export default Profile