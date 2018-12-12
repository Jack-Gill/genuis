import React from 'react';
import styled from 'styled-components';
import logo from '../logo.svg'

const ResultsItem = ({name, artist, thumbnailURL, hot}) => (
    <div>
        <Wrapper>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <img src={thumbnailURL} alt={"Smiley face"} height={"42"} width={"42"}/>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0 5px'
            }}>
                <span>{name}</span>
                <span style={{
                    fontWeight: '300',
                }}>{artist}</span>
            </div>
            {hot &&
                <div style={{
                    marginLeft: 'auto',
                    paddingRight: '8px',
                }}>
                    <i className="material-icons">hot_tub</i>
                </div>
            }
        </Wrapper>
    </div>
);

const Wrapper = styled.div`
    width: 320px;
    border: 1px solid grey;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export default ResultsItem;