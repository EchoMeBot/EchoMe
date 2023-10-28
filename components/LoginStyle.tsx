import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-top: 12vh;
    width: 100%;
    /* background-color: ${(props) => props.theme.backgroundColor}; */
    /* background-image: url("../../images/background_05.png"); */
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
`

const Main = styled.div`
    height: 76vh;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`

const LoginBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
`

const TextBox = styled.div`
    width: 32%;
    height: 80%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 24px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
        // 회원가입 텍스트
        margin-bottom: 2vh;
    }
`

const Forms = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    form {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 75%;

        // 입력 폼

        input {
            // 데이터 입력 폼
            border: none;
            padding: 1vh;
            width: 100%;
        }

        button {
            border: none;
            padding: 1vh;
            cursor: pointer;
            background-color: ${(props) => props.theme.highlightColor};
        }
    }
`

const ButtonBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    width: 100%;

    border-radius: 8px;

    overflow: hidden;

    transition: background-color ease 0.3s;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

    button {
        width: 100%;
        background-color: ${(props) => props.theme.backgroundColor};
        font-weight: bold;
    }
`

const InputBox = styled.div`
    overflow: hidden;
    padding: 0 1px 6px 1px;

    border: 3px solid ${(props) => props.theme.blurColor2};
    border-radius: 8px;
    width: 100%;

    margin-bottom: 36px;
`

const Lines = styled.div`
    color: ${(props) => props.theme.highlightColor};
    font-size: 24px;
    h2 {
        font-size: 32px;
        color: ${(props) => props.theme.highlightColor2};
    }

    h3 {
        font-size: 24px;
        color: ${(props) => props.theme.textColor};
    }

    h4 {
        font-size: 24px;
        color: ${(props) => props.theme.textColor};
    }

    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Line = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 6px;
    margin-bottom: 2vh;
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    font-size: 24px;
    color: ${(props) => props.theme.highlightColor};
    h4 {
        color: ${(props) => props.theme.textColor};
    }

    img {
        width: 36px;
    }
`

const Quote = styled.div`
    margin-top: 6px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 12px;

    b {
        cursor: pointer;
        transition: color ease 0.3s;
        &:hover {
            color: ${(props) => props.theme.highlightColor};
        }
    }
`

const Error = styled.span`
    height: 3vh;
    margin-top: 6px;

    color: ${(props) => props.theme.errorColor};
    font-weight: bold;
`

interface IButtonProps {
    width: string
    height: string
    hover: string
    text: string
    border?: string
    color?: string
    onclick?: () => void
}

interface IBoxProps {
    width: string
    height: string
    hover: string
    border?: string
    color?: string
}

export default function LoginStyle() {
    return (
        <Container>
            <Main>
                <LoginBox>
                    <TextBox>
                        <Lines>
                            <Line></Line>
                        </Lines>
                        <Forms>
                            <InputBox></InputBox>
                        </Forms>
                    </TextBox>
                </LoginBox>
            </Main>
        </Container>
    )
}
