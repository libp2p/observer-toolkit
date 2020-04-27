import styled from 'styled-components'

function getColor(theme, disabled, isActive) {
  if (disabled) return theme.color('text', 2)
  if (isActive) return theme.color('text', 3)
  return theme.color('highlight')
}

const StyledButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing()}`};
  position: relative;
  z-index: 5;
  cursor: ${({ disabled, onClick }) =>
    !disabled && !!onClick ? 'pointer' : 'default'};
  font-weight: bold;
  white-space: nowrap;
  &:focus {
    outline: none;
  }
  ${({ theme, isActive, disabled }) => {
    return `
      background: ${theme.color(isActive ? 'highlight' : 'background')};
      border: 1px solid ${getColor(theme, disabled, false)};
      color: ${getColor(theme, disabled, isActive)};
    `
  }}
`

export default StyledButton
