import styled from 'styled-components'

const StyledButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing()}`};
  position: relative;
  z-index: 5;
  cursor: pointer;
  font-weight: bold;
  border-radius: 12px;
  &:focus {
    outline: none;
  }
  ${({ theme, isActive }) => {
    const top = isActive ? 'dark' : 'light'
    const bottom = isActive ? 'light' : 'dark'
    return `
      background: ${theme.color('tertiary', isActive ? 'dark' : 'mid')};
      border-top: 4px solid ${theme.color(top, 'mid', 0.3)};
      border-left: 4px solid ${theme.color(top, 'mid', 0.3)};
      border-bottom: 4px solid ${theme.color(bottom, 'mid', 0.3)};
      border-right: 4px solid ${theme.color(bottom, 'mid', 0.3)};
      color: ${theme.color(isActive ? 'light' : 'text', 'mid')};
    `
  }}
`

export default StyledButton
