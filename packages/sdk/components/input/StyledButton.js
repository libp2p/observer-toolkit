import styled from 'styled-components'

const StyledButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing()}`};
  position: relative;
  z-index: 5;
  cursor: pointer;
  font-weight: bold;
  &:focus {
    outline: none;
  }
  ${({ theme, isActive }) => {
    return `
      background: ${theme.color(isActive ? 'highlight' : 'background')};
      border: 1px solid ${theme.color('highlight')};
      color: ${theme.color(isActive ? 'text' : 'highlight', isActive ? 3 : 0)};
    `
  }}
`

export default StyledButton
