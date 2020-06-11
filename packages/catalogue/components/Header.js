import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import { useHidePrevious, Icon, Tooltip } from '@nearform/observer-sdk'

const HeaderOuter = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing([0, 1])};
  height: ${({ theme }) => theme.spacing(8)};
  align-items: center;
  justify-content: space-between;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.text('body', 'medium')};
  color: ${({ theme }) => theme.color('contrast', 1)};
  text-decoration: none;
`

const Logo = styled.img`
  height: 48px;
  display: block;
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const NavTray = styled.nav`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.text('body', 'large')};
  color: ${({ theme }) => theme.color('text', 2)};
  font-weight: 600;
`

const NavLink = styled.a`
  display: block;
  white-space: nowrap;
  margin: ${({ theme }) => theme.spacing([0, 2])};
  text-decoration: none;
  color: ${({ theme }) => theme.color('text', 2)};
`

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.color('contrast', 1)};
  text-decoration: none;
`

const ExpandIcon = styled.span`
  transform: rotate(90deg);
  [data-tooltip='open'] > * > & {
    transform: rotate(180deg);
  }
  ${({ theme }) => theme.transition({ property: 'transform' })}
  margin-bottom: 2px;
`

const ContentTooltip = styled.div`
  min-width: 320px;
  padding: ${({ theme }) => theme.spacing([2, 4])};
  ${({ theme }) => theme.text('body', 'medium')};
  font-weight: 400;
  & a {
    font-weight: 600;
    text-decoration: none;
  }
  & a:link {
    color: ${({ theme }) => theme.color('contrast', 1)};
  }
  & a:visited {
    color: ${({ theme }) => theme.color('contrast', 2)};
  }
`

function Header({ title, content = [] }) {
  const hidePrevious = useHidePrevious()
  return (
    <HeaderOuter>
      <StyledLink
        to={{
          pathname: '/',
          state: { fromLink: true },
        }}
      >
        <LogoContainer>
          <Logo src="logo_medium.png" /> {title}
        </LogoContainer>
      </StyledLink>
      <NavTray>
        {content.map(
          item =>
            (item.content && (
              <Tooltip
                content={<ReactMarkdown source={item.content} />}
                side="bottom"
                toleranceY={null}
                fixOn="no-hover"
                hidePrevious={hidePrevious}
                override={{ Content: ContentTooltip }}
              >
                <NavLink>
                  {item.title}
                  <Icon type="expand" override={{ Container: ExpandIcon }} />
                </NavLink>
              </Tooltip>
            )) ||
            (item.url && (
              <NavLink href={item.url} target="_blank">
                {item.title}
              </NavLink>
            )) ||
            ''
        )}
      </NavTray>
    </HeaderOuter>
  )
}

Header.propTypes = {
  title: T.string,
  content: T.array,
}

export default Header
