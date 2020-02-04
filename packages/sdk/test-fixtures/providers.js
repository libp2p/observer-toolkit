import {
  DataProvider,
  FilterProvider,
  RootNodeProvider,
} from '../components/context'

const providers = {
  DataProvider,
  FilterProvider,
  RootNodeProvider,
}

// In SDK tests, import test wrappers from '@libp2p-observer/testing'
// and wrap test components with that, passing this as 'providers' prop
export default providers
