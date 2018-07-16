import { bootstrapFiles } from '../bootstrap/index'
import { layout } from '../layout'

bootstrapFiles()

const welcomeMessage = () =>
  `<center>
    <h1>Welcome!</h1>
    <h4>Please log in or create a free account</h4>
  </center>
`

export { welcomeMessage }