import {apiRoutes} from './routes'
import axios from 'axios'
import postSongs from "./createPostSongs";

const pollUpdates = (requestId) => {
    axios
        .get(apiRoutes.pollUpdates + requestId)
        .then((response) => {
            if (response) {
                const status = response?.data?.state
                let audio = null
                if (response.data?.isReady) {
                    const song = response.data?.file64
                    audio = new Audio('data:audio/wav;base64,' + song)
                    // snd.play()
                }
                return {status, audio}
            }
        })
        .catch((e) => {
            console.error(e?.message || e)
        })
}
export default pollUpdates
