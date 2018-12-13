import React from 'react';
import styled from 'styled-components';

const ResultsItem = ({name, artist}) => (
    <Wrapper>
        <div>
            {name}
        </div>
        <div>
            {artist}
        </div>
    </Wrapper>
);

const Wrapper = styled.div`
    width: 320px;
    border: 1px solid red;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export default ResultsItem;