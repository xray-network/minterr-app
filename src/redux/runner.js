import { useDispatch } from "react-redux"

const Runner = ({ children }) => {
  const dispatch = useDispatch()

  setInterval(() => {
    dispatch({
      type: "settings/FETCH_NETWORK_STATE",
    })
  }, 60 * 1000)

  return children
}

export default Runner
