## Getting Started

Make sure to run a `yarn install` in the root directory *and* the functions directory. (basically in every directory with a `package.json`)

### Firebase Functions

#### Setting up environment variables

To start with you'll need to place the Firebase Functions service account json in the `service-account-json` directory.

Then you need to update the `.envrc` file with `export GOOGLE_APPLICATION_CREDENTIALS="path/to/file.json"`

You can get the json file from the [Google Cloud Project Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts?project=genuis-1553116125288)

Then find the App Engine default service account and select `Create Key` from the menu and choose the `JSON` option.

To make Environment Variables available to firebase functions when running them locally, you'll need to run the following command. Replace placeholders with the appropriate values.

```bash
firebase functions:config:set genius.auth_token="<INSERT GENIUS AUTH TOKEN>"
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

Also starts up Firebase Functions local emulation, these are not compiled so changes to files within the `functions` directory are effective immediately.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Functions