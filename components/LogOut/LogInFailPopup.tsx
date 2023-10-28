import React from 'react'
import styled from 'styled-components'
import Button from '../Button'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import { logInFailState } from '../../utils/atoms'

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; /* 팝업이 화면 위에 오도록 설정합니다. */
`

const ModalContent = styled.div`
    height: 40%;
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const LogInFailPopup = () => {
    const [logInFail, setlogInFailState] = useRecoilState(logInFailState)
    const home = () => {
        setlogInFailState(false)
    }
    return (
        <ModalBackground>
            <ModalContent>
                <h2>로그인 실패</h2>
                <p>ID 또는 PASSWORD를 다시 확인해 주세요</p>
                <Button
                    width={'40%'}
                    height={'20%'}
                    hover={'yellow'}
                    text={'확 인'}
                    onclick={() => home()}
                />
            </ModalContent>
        </ModalBackground>
    )
}

export default LogInFailPopup
