import React from 'react';
import styled from 'styled-components';
import {Link} from '@reach/router';

const ResultsItem = ({name, artist, thumbnailURL, hot, id, onClick}) => (
    <StyledLink to={`/result/${id}`}>
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
    </StyledLink>
);

const Wrapper = styled.div`
    width: 320px;
    border: 1px solid grey;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const StyledLink = styled(Link)`
    color: black;
    text-decoration: none;
`;

export default ResultsItem;