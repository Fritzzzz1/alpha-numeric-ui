import React from 'react'
import LOGO from './assets/logo_medium.png'
import WAVEFORM from './assets/waveform.png'
import styled from 'styled-components'
import {useState, createContext} from 'react'
import Colors from './Colors'
import postSongs from './Api/createPostSongs'
import MainBottomContainer from './Components/MainBottomContainer'
import MainUpperContainer from './Components/MainUpperContainer'
import {
    DEFAULT_SETTINGS,
    ERROR_PROMPT,
    PROMPT_BY_REQUEST_STATUS,
    lorem,
} from './app_constants'

export const InputContext = createContext()

const App = () => {
    const [firstUrl, setFirstUrl] = useState(null)
    const [secondUrl, setSecondUrl] = useState(null)
    const [error, setError] = useState(null)
    const [ready, setReady] = useState(false)
    const [move, setMove] = useState(false)
    const [queryOptions, setQueryOptions] = useState(DEFAULT_SETTINGS)
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
    const [trackingId, setTrackingId] = useState(null)

    const [requestStatus, setRequestStatus] = useState(
        PROMPT_BY_REQUEST_STATUS.PRE,
    )

    const didInsertLinks = firstUrl && secondUrl

    const audioPrepared = requestStatus === PROMPT_BY_REQUEST_STATUS.DONE

    const go = () => {
        if (didInsertLinks) {
            setMove(true)
            setReady(true)
            const request = postSongs([firstUrl, secondUrl], queryOptions)
            if (request) {
                const {requestId} = request
                setTrackingId(requestId)
                setRequestStatus(PROMPT_BY_REQUEST_STATUS.pre)
            }
            if (error) {
                resetError()
            }
        } else {
            setError(ERROR_PROMPT)
        }
    }

    const resetError = () => {
        setError(null)
    }

    const doShowSettings = () => setShowAdvancedSettings(true)
    const dontShowSettings = () => setShowAdvancedSettings(false)

    return (
        <Container>
            {showAdvancedSettings && (
                <DescriptionText> {lorem}</DescriptionText>
            )}
            <Page>
                <Logo src={LOGO} />
                <InputContext.Provider
                    value={{
                        firstUrl,
                        setFirstUrl,
                        secondUrl,
                        setSecondUrl,
                        queryOptions,
                        setQueryOptions,
                        requestStatus,
                        setRequestStatus,
                        trackingId,
                    }}>
                    <MainUpperContainer
                        error={error}
                        resetError={resetError}
                        isready={ready}
                        isShowSettings={showAdvancedSettings}
                        doShowSettings={doShowSettings}
                        dontShowSettings={dontShowSettings}
                    />
                </InputContext.Provider>
                <WaveForm src={WAVEFORM} move={move} ready={audioPrepared} />
                <MainBottomContainer
                    onClick={go}
                    isready={ready}
                    showSettings={showAdvancedSettings}
                />
            </Page>
        </Container>
    )
}

export default App

const Container = styled.div`
    width: 100vw;
    height: 100%;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    background-color: #fffdd0;
    display: flex;
`
const Page = styled.div`
    display: flex;
    align-self: center;
    flex-direction: column;
    background-color: ${Colors.BLUE_NEW_BACKGROUND};
    padding: 2px;
    width: 40%;
    border-radius: 100px;
    align-items: center;
    justify-content: flex-start;
`
const Logo = styled.img`
    margin-top: 50px;
    // background: ${Colors.LIGHT_PURPLE_NEW};
`

const WaveForm = styled.img`
    height: 140px;
    width: 38vw;
    margin-top: 10px;
    margin-bottom: 10px;
    transform: rotate(0deg);
    transition: transform 100s ease-out;
    ${(props) =>
        props.move &&
        `
            transform: rotate(7200deg);
        `};
    ${(props) =>
        props.ready &&
        `
            transform: scale(2, 0.5);
        `};
`
const DescriptionText = styled.div`
    justify-content: flex-start;
    max-width: 30%;
`
