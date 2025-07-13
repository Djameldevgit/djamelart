import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
 
import { monstrarmodelo } from './../../redux/actions/provaAction';
 
const Prova = () => {
  const {provaReducer} = useSelector(state=>state)
  const dispatch = useDispatch()
const show = ()=> {
dispatch(monstrarmodelo(âyload))

}

  return (
    <div>Prova
<button onClick={show}> monstrar</button>


    </div>
  )
}

export default Prova