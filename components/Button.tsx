import styled from 'styled-components'

const OuterBox = styled.div<IBoxProps>`
    background-color: ${(props) => props.theme.backgroundColor};
    border-radius: ${(props) => (props.border ? props.border : '15px')};
    overflow: hidden;

    box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.3);
    width: ${(props) => props.width};
    height: ${(props) => props.height};

    cursor: pointer;
    user-select: none;

    margin-bottom: 12px;
`

const InnerBox = styled.div<IBoxProps>`
    background-color: ${(props) =>
        props.color === 'red'
            ? props.theme.errorColor
            : props.color === 'yellow'
            ? props.theme.highlightColor
            : props.color === 'black'
            ? props.theme.borderColor
            : props.theme.backgroundColor};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition: background-color ease 0.3s, color ease 0.3s;

    h2 {
        font-size: 100%;
    }

    &:hover {
        background-color: ${(props) =>
            props.hover === 'mint'
                ? props.theme.highlightColor2
                : props.hover === 'yellow'
                ? props.theme.highlightColor
                : props.hover === 'white'
                ? props.theme.backgroundColor
                : props.hover === 'black'
                ? props.theme.borderColor
                : 'none'};

        color: ${(props) => props.theme.backgroundColor};
    }
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

export default function Button({
    width,
    height,
    hover,
    text,
    border,
    color,
    onclick,
}: IButtonProps) {
    return (
        <OuterBox
            width={width}
            height={height}
            hover={hover}
            border={border}
            color={color}
            onClick={onclick}
        >
            <InnerBox
                width={width}
                height={height}
                hover={hover}
                border={border}
                color={color}
            >
                <h2>{text}</h2>
            </InnerBox>
        </OuterBox>
    )
}
