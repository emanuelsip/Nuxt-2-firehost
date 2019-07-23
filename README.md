# Nuxt.js 2 firehost 2019
#How to deploy nuxt2 ssr on firehost July 2019

Base on this tutorial(https://bit.ly/2LsdCnY) I wasn't able to deploy nuxt.js 2 ssr on firebase hosting.
Finally (after a couple  day's seeing at the clouds xD ) I made up what was happening, so I decide to share with you how I made it work.
I will try to be clear with the steps and the explanations. (I'm not a navie english writter :D)

Install firebase tools:

```
https://www.npmjs.com/package/firebase-tools
```

From now "folder" is your directory wherever name or place you decide to put your project.

1. Create your project on /folder/:

```
npx create-nuxt-app src
```

          ? Project name > src
          ? Project description > test
          ? Author name > Your name
          ? Choose the package manager > Npm
          ? Choose UI framework > Bootstrap Vue
          ? Choose custom server framework > Express
          ? Choose Nuxt.js modules (Press <space> to select, <a> to toggle all, <i> to invert selection) > NONE
          ? Choose linting tools (Press <space> to select, <a> to toggle all, <i> to invert selection) > NONE
          ? Choose test framework > None
          ? Choose rendering mode Universal > (SSR)


2. Configure fibase on /folder/:

```
firebase init
```

          ? What language would you like to use to write Cloud Functions? > JavaScript
          ? Do you want to use ESLint to catch probable bugs and enforce style? > No
          ? Do you want to install dependencies with npm now? > Yes
          ? What do you want to use as your public directory? > public
          ? Configure as a single-page app (rewrite all urls to /index.html)? > No


3. This files will not be used, so remove them on /folder/ run:

```
rm -rf public/index.html public/404.html /**/
```

4. Install Router on /folder/src/:

```
npm install vue-router
```

5. Copy and merge dependencies from /folder/src/package.json to /folder/functions/package.json

*I just copy and paste the dependencies that aren't in functions/package.json.
This file must have the libraries you use in your Nuxt.js app. You must end up
with something like this:*

```
/folder/functions/package.json
            ...
            "dependencies": {
              "firebase-admin": "^8.0.0",
              "firebase-functions": "^3.1.0",
              "cross-env": "^5.2.0",
              "express": "^4.16.4",
              "bootstrap-vue": "^2.0.0-rc.11",
              "bootstrap": "^4.1.3",
              "nuxt": "^2.0.0",
              "vue-router": "^3.0.7"
            },
            ...
```
*Or you can simply install every dependency with npm install*

6. Install all packages on /folder/functions/, run:

```
npm install
```

7. Add to /folder/functions/nuxt.config.js:

```
...
buildDir:'nuxt',
build: {
  publicPath:'/public/',
  ...
}
```

8. On /folder/ run:

```
copy -R src/nuxt.config.js to functions/
```

9. Building app /folder/src/:

```
npm run build
```

*I tried to build directly on the "buildDir:'../functions/nuxt" folder
(like the tutorial said) but some things like plugins doesn't work.
So we need to build the app on src/ and then
copy the nuxt folder to functions (step 10).*

 **IMPORTANT**
    *When you are coding your app, you need to comment this line
    in order to work on http://localhost:3000/, :
    // publicPath:'/public/'.
    when you build the app to deploy on firehost, uncomment the line and build.*

10. On /folder/ run:

```
cp -R functions/nuxt/dist/client public/
```
*This is the most important step, the original tutorial said to copy the "dist"
folder content, but in  Nuxt.js version 2 (I presume), this folder structure
doesn't work because generates two folders, "dist/client" and "dist/server",
so we need to create and copy the files from folder/dist/client
flat in to the folder/public/ folder.*

```
cp -R src/nuxt/ functions/nuxt/
```

*Copy the builded folder, execute this
when you are ready to upload your final app to firehost*

11.  On /folder/firebase.json add or replace if exists:

```
"rewrites": [
  {
    "source": "**",
    "function": "ssrapp"
  }
]
```

12.  To check if everything works fine, on /folder/ run:

```
firebase serve --only functions,hosting
```

*If you get an error like this:
"hosting: We found a hosting key inside firebase.json as well as hosting configuration
keys that are not nested inside the hosting key.
Please run firebase tools:migrate to fix this issue.
Please note that this will overwrite any configuration keys nested inside the hosting
key with configuration keys at the root level of firebase.json.
Error: Hosting key and legacy hosting keys are both present in firebase.json.
Having trouble? Try firebase serve --help"*

**Execute the command "firebase tools:migrate"and select yes.**


14. Finally deploy your project, on /folder/ run:
```
On /folder/functions/index.js
    change  publicPath:'/public/' with publicPath:'/'
On /folder/functions/nuxt.config.js
    change  publicPath:'/public/' with publicPath:'/'
On /folder/src/nuxt.config.js
    change  publicPath:'/public/' with publicPath:'/'
```
Then repeat steps **10** and **11** and finaly
```
firebase deploy
```

Then you should be able deploy and see  your project on firehost. YAY!
https://bit.ly/IqT6zt
