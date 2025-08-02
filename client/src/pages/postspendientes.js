import React, { useEffect ,useState} from 'react'

 
import { useDispatch, useSelector } from 'react-redux'
import PostsPendientes from '../components/home/PostsPendientes';
import LoadIcon from  '../images/loading.gif'
import { getPosts } from '../redux/actions/postAction'
import { useTranslation } from 'react-i18next';

let scroll = 0;
 
const Postspendientes = () => {
    const { homePostsAprove,languageReducer ,auth} = useSelector(state => state)
    const { t } = useTranslation('navbar');
    const lang = languageReducer.language || 'es';

    const dispatch = useDispatch()
       window.addEventListener('scroll', () => {
           if(window.location.pathname === '/'){
               scroll = window.pageYOffset
               return scroll;
           }
       })
   
       const [prevPostCount, setPrevPostCount] = useState(homePostsAprove.posts.length);
   
       useEffect(() => {
           if (homePostsAprove.posts.length > prevPostCount) {
               dispatch(getPosts(auth.token)); 
               setPrevPostCount(homePostsAprove.posts.length);
           }
       }, [homePostsAprove.posts.length, dispatch, auth.token, prevPostCount]);
   
     
       return (
           <div className="home  mx-0">
            
              
   
                   {
                       homePostsAprove.loading 
                       ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                       : (homePostsAprove.result === 0 && homePostsAprove.posts.length === 0)
                           ? <h2 className="text-center">{t('No_Post', { lng: lang })}</h2>
                           : <PostsPendientes />
                   }
                   
               
               
                
           </div>
       )
   }
export default Postspendientes

