import React from 'react'
import { }

function ContextWrappers() {
  return (
    <ThemeSetter>
      <DataProvider initialData={mockData}>
        <Page>
          <Content>{children}</Content>
          <Controls>
            <Timeline />
          </Controls>
        </Page>
      </DataProvider>
    </ThemeSetter>
  )
}
