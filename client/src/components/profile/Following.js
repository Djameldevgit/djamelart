import React from 'react'
import UserCard from '../UserCard'
import FollowBtn from '../FollowBtn'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const Following = ({users, setShowFollowing}) => {
    const { auth, languageReducer } = useSelector(state => state)
    const { t } = useTranslation('profile')
    const lang = languageReducer?.language || 'en'

    return (
        <div className="follow">
            <div className="follow_box">
                <h5 className="text-center">{t('following', { lng: lang })}</h5>
                <hr/>

                <div className="follow_content">
                    {users.map(user => (
                        <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing}>
                            {auth.user._id !== user._id && <FollowBtn user={user} />}
                        </UserCard>
                    ))}
                </div>

                <div className="close" onClick={() => setShowFollowing(false)}>
                    &times;
                </div>
            </div>
        </div>
    )
}

export default Following