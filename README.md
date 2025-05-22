# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# To run the project go through below instruction
## when you have face any issues, then contact repository owner 👋

Install dependencies

 ```bash
   npm i @react-native-community/netinfo
   ```
 ```bash
   npm i react-native-element-dropdown
   ```

Add Files( first only copy paste then modify according to your need )

- [AuthScreen/index.js](https://github.com/SouvagyaDash29/expo-template/blob/main/app/AuthScreen/index.js)
- [PinScreen/index.js](https://github.com/SouvagyaDash29/expo-template/blob/main/app/PinScreen/index.js)
- [src/screens/ChangePassword.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/screens/ChangePassword.js)

Add Files
- [src/components/Modals.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/components/Modals.js)
- [src/components/CompanyDropdown.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/components/CompanyDropdown.js)
- [src/components/ConfirmationModal.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/components/ConfirmationModal.js)
- [src/components/NetworkErrorModal.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/components/NetworkErrorModal.js)

Only Copy and paste
- [src/services/HttpMethod.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/services/HttpMethod.js)
- [src/services/HttpMethod.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/services/HttpMethod.js)
- [src/services/authServices.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/services/authServices.js)
- [src/services/localStore.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/services/localStore.js)
- [src/services/productServices.js](https://github.com/SouvagyaDash29/expo-template/blob/main/src/services/productServices.js)
in src/services/productServices.js copy from line 101.


Modify in ConstantServices.js
 ```bash
   const getDbName = async () => {
  let dbName = await AsyncStorage.getItem('dbName');
  return dbName;
}
const db_name = getDbName();
   ```

 ```bash
   export const userLoginURL = async () => {
  const db_name = await getDbName();
   return `${endpoint}/customer_user_login/${db_name}/`;
}

export const setUserPinURL =  async () => {
  const db_name = await getDbName();
  return `${endpoint}/set_user_pin/${db_name}/`;
} 

export const profileInfoURL = async () => {
   const db_name = await getDbName();
  return  `${endpoint}/profile_info/${db_name}/`;
}

export const getDbList = `${endpoint}/get_applicable_site/`;
   ```
if you add new api then follow above structure.

