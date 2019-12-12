import React, { useMemo } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import ColorHash from 'color-hash'
const colorHash = new ColorHash()

const SvgContainer = styled.svg`
  width: 2em;
  height: 2em;
  vertical-align: middle;
`

function getColors(peerId) {
  const quarter = Math.floor(peerId.length / 4)
  const half = Math.floor(peerId.length / 2)
  const colors = [
    colorHash.hex(peerId.slice(0, quarter)),
    colorHash.hex(peerId.slice(quarter + 1, 2 * quarter)),
    colorHash.hex(peerId.slice(2 * quarter + 1, 3 * quarter)),
    colorHash.hex(peerId.slice(3 * quarter + 1, 4 * quarter)),
    colorHash.hex(peerId.slice(0, half)),
    colorHash.hex(peerId.slice(half + 1, 2 * half)),
    colorHash.hex(peerId),
  ]
  return colors
}

// SVG src in theme/graphics-src
function PeerAvatar({ peerId, ...props }) {
  const colors = useMemo(() => getColors(peerId), [peerId])

  return (
    <SvgContainer viewBox="0 0 32 32" {...props}>
      <path
        fill={colors[0]}
        d="M26.861 9.752l-.364.201-10.356 5.783v.197l-.055.033 10.518 6.165.257-.153V9.752"
      />
      <path
        fill={colors[1]}
        d="M15.998 16.104L5.482 22.272l10.516 6.163V16.104M5.093 9.815v12.226l.14.083V9.893l-.14-.078"
      />
      <path
        fill={colors[2]}
        d="M16.086 16.055l-.088.049v12.332l10.606-6.216-10.518-6.165m10.824-6.24l-.049.026v12.226l.049-.026V9.815"
      />
      <path
        fill={colors[3]}
        d="M5.232 9.893v12.231l.25.148 10.516-6.168v-.101l-.042-.028v-.097L5.414 9.994l-.182-.101"
      />
      <path
        fill={colors[4]}
        d="M16.141 3.854v11.902l10.356-5.713.364-.201-1.808-1.07-8.912-4.918m-.185-.103v.148l.133-.075-.133-.073"
      />
      <path
        fill={colors[5]}
        d="M15.956 3.899L5.232 9.815v.078l.182.101 10.542 5.814V3.899m.185-.103l-.052.028.052.029v-.057"
      />
      <path
        fill={colors[6]}
        d="M11.664 18.348v-4.816l4.338-2.563 3.866 2.285.468.26v4.836l-4.334 2.541z"
      />
      <path
        fill="#FFF"
        d="M27.689 9.753c0-.001-.002-.003-.002-.007-.001-.062-.032-.115-.047-.175-.009-.021-.01-.044-.018-.065-.067-.19-.178-.364-.36-.465l-1.756-.969-.028-.018-.012-.005-9.046-5.346c-.032-.019-.066-.021-.101-.036-.054-.022-.107-.045-.166-.057-.052-.01-.103-.01-.156-.01s-.104 0-.157.01a.787.787 0 00-.159.055c-.037.015-.074.018-.107.037l-10.86 6.42a.831.831 0 00-.408.73.791.791 0 00.095.33v12.235c0 .298.16.574.418.72.029.017.063.014.094.027l10.471 6.138c.199.118.434.114.651.053a.815.815 0 00.558-.078l10.45-6.126c.08-.017.163-.02.234-.063a.828.828 0 00.418-.72V9.77c-.001-.007-.006-.01-.006-.017zm-10.715-4.49l7.661 4.229.551.325-4.913 2.71-3.299-1.949V5.263zm-1.85.046v5.214l-3.394 2.004-4.846-2.673 8.24-4.545zm-9.06 6.002l4.768 2.661v4.197l-4.768 2.796v-9.654zm8.907 15.822L6.933 22.42l5.016-2.94 3.022 1.772v5.881zm1.031-7.207l-3.506-2.057V14.006l.926-.546.318-.187 2.262-1.336 3.502 2.066V17.872L17.753 18.9l-.75.439-1.001.587zm1.001 7.18V21.27l3.146-1.846 4.981 2.919-8.127 4.763zm9.026-6.188l-4.861-2.85v-4.096l4.861-2.715v9.661z"
      />
    </SvgContainer>
  )
}

PeerAvatar.propTypes = {
  peerId: T.string,
}

export default PeerAvatar
