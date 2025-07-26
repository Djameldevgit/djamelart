import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../../UserCard'
import Card from 'react-bootstrap/Card';
import { useSelector, useDispatch } from 'react-redux'
import { getDataAPI } from '../../../utils/fetchData'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { useHistory, useParams } from 'react-router-dom'
import { MESS_TYPES, getConversations } from '../../../redux/actions/messageAction'


const LeftSide = () => {
    const { auth, message, online } = useSelector(state => state)
    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUsers] = useState([])

    const history = useHistory()
    const { id } = useParams()

    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    
    useEffect(() => {
        const loadAdmins = async () => {
            try {
                const res = await getDataAPI('users/admins', auth.token); // Nueva ruta para obtener todos los admins
                setSearchUsers(res.data.users);
            } catch (err) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: err.response?.data?.msg || 'Error al cargar administradores' }
                });
            }
        };
        loadAdmins();
    }, [auth.token, dispatch]);

    // 2. Función de búsqueda filtrada (opcional, si aún quieres permitir búsqueda manual)
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await getDataAPI(`users/admins?username=${search}`, auth.token); // Filtra admins por username
            setSearchUsers(res.data.users);
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response?.data?.msg || 'Error al buscar' }
            });
        }
    };
    const handleAddUser = (user) => {
        setSearch('')
        setSearchUsers([])
        dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: []}})
        dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        return history.push(`/message/${user._id}`)
    }

    const isActive = (user) => {
        if(id === user._id) return 'active';
        return ''
    }

    useEffect(() => {
        if(message.firstLoad) return;
        dispatch(getConversations({auth}))
    },[dispatch, auth, message.firstLoad])

    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting){
                setPage(p => p + 1)
            }
        },{
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    },[setPage])

    useEffect(() => {
        if(message.resultUsers >= (page - 1) * 9 && page > 1){
            dispatch(getConversations({auth, page}))
        }
    },[message.resultUsers, page, auth, dispatch])
    

    // Check User Online - Offline
    useEffect(() => {
        if(message.firstLoad) {
            dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        }
    },[online, message.firstLoad, dispatch])

    return (
        <>
       <Card>
      <Card.Header>chat administrativo</Card.Header>
      </Card>
            <div className="message_chat_list">
                {
                    searchUsers.length !== 0
                    ?  <>
                        {
                            searchUsers.map(user => (
                                <div key={user._id} className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}>
                                    <UserCard user={user} />
                                </div>
                            ))
                        }
                        
                    </>
                    : <>
                        {
                            message.users.map(user => (
                                <div key={user._id} className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}>
                                
                                <UserCard user={user} msg={true}>
                                    {
                                        user.online ? (
                                            <i className="fas fa-user text-success" title="En línea" />
                                        ) : (
                                            auth.user.following.some(f => f._id === user._id) && (
                                                <i className="fas fa-user text-danger" title="Desconectado" />
                                            )
                                        )
                                    }
                                </UserCard>
                            </div>
                            
                            
                            ))
                        }
                    </>
                }
               
               <button ref={pageEnd} style={{opacity: 0}} >Load More</button>
            </div>
        </>
    )
}

export default LeftSide
