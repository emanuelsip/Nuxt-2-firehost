# Nuxt.js 2 firehost 2019
#How to deploy nuxt2 ssr on firehost July 2019

Basado en este tutorial(https://bit.ly/2LsdCnY) No podía desplegar Nust.js 2 en firebase hosting.
Finalmente (después de quedarme viendo a las nubes un largo rato jeje ) Logré encontrar que estaba pasando, entonces decidí compartir con ustedes como hice que funcionara.
Voy a tratar de ser claro con  pasos y explicaciones.

Instalar firebase tools:

```
https://www.npmjs.com/package/firebase-tools
```

Como referencia, desde ahoranow "folder" será el nombre que le hayan puesto a su proyecto no importa donde lo hayan colocado.

1. Crear el proyecto Nuxt.js en /folder/:

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


2. Configurar fibase en /folder/:

```
firebase init
```

          ? What language would you like to use to write Cloud Functions? > JavaScript
          ? Do you want to use ESLint to catch probable bugs and enforce style? > No
          ? Do you want to install dependencies with npm now? > Yes
          ? What do you want to use as your public directory? > public
          ? Configure as a single-page app (rewrite all urls to /index.html)? > No


3. Estos archivos no los utilizaremos, entonces los eliminamos ejecutando en /folder/, en la terminal:

```
rm -rf public/index.html public/404.html /**/
```

4. Instalamos router en /folder/src/:

```
npm install vue-router
```

5. Copiar y unir todas las dependencias de /folder/src/package.json a /folder/functions/package.json

*Yo solo copio y pego las dependencias que instalo en mi aplicación esto porque firebase debe
saber que dependencias existen e instalarlas en la nube. El archivo debería quedar algo así:*

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
*O simplemente instala las dependencias en /src/ y en /functions/*

6. Instalar todos los paquetes en /folder/functions/, ejecutando en la terminal:

```
npm install
```

7. Agregar el siguiente comando a /folder/functions/nuxt.config.js:

```
...
buildDir:'nuxt',
build: {
  publicPath:'/public/',
  ...
}
```

8. En /folder/ ejecutar en la terminal:

```
copy -R src/nuxt.config.js to functions/
```

9. Compilar en /folder/src/:

```
npm run build
```

*En el tutorial de firebase dice que tienes que configurar "buildDir:'../functions/nuxt"
pero no me funcionaron unos plugins que quice utilizar, entonces encontré que se
debe omitir este paso y no configurar el buildir directamente a functions,
en todo caso colocarlo como "buildDir:'nuxt". Y compilar*

 **NOTA IMPORTANTE**
    *Cuando estes trabajando en dev en tu computadora (http://localhost:3000/),
    tienes que comentar la linea:
    // publicPath:'/public/'.
    Cuando ya estes listo para subir tu código a firehost, quitar el comentario
    publicPath:'/public/' y compila nuevamente antes de hacer los siguientes pasos*

10. En /folder/ ejecutar:
```
cp -R src/nuxt/ functions/nuxt/
```

*Copiar el directorio compilado tomando encuenta las indicaciones del
paso 9*

```
cp -R functions/nuxt/dist/client public/
```
*Este es uno de los inconvenientes que encontré, en el tutorial original te
dice que copies todo el "dist" dentro de public, pero en Nuxt.js versión 2  (creo!),
esto no funciona porque se generan dos folders "dist/client" and "dist/server",
entonces necesitamos copiar solo los archivos de la carpeta "client" en
"public".*



11.  En /folder/firebase.json agregas o reemplazas si existe:

```
"rewrites": [
  {
    "source": "**",
    "function": "ssrapp"
  }
]
```

12.  Para ver que todo esté funcionando bien antes de subir, en /folder/ ejecutar:

```
firebase serve --only functions,hosting
```

*Si te genera un error como este:
"hosting: We found a hosting key inside firebase.json as well as hosting configuration
keys that are not nested inside the hosting key.
Please run firebase tools:migrate to fix this issue.
Please note that this will overwrite any configuration keys nested inside the hosting
key with configuration keys at the root level of firebase.json.
Error: Hosting key and legacy hosting keys are both present in firebase.json.
Having trouble? Try firebase serve --help"*

**Ejecuta el comando que indica: "firebase tools:migrate" y selecciona que si.**


14. Finalmente subir tu aplicación, asegurate editar lo siguiente:
```
En /folder/functions/index.js
    change  publicPath:'/public/' with publicPath:'/'
En /folder/functions/nuxt.config.js
    change  publicPath:'/public/' with publicPath:'/'
En /folder/src/nuxt.config.js
    change  publicPath:'/public/' with publicPath:'/'
```
Después ejecuta **10** y **11** , y finalmente
```
firebase deploy
```

Ahora debería subir tu proyecto sin problemas. Yupiii!(https://bit.ly/IqT6zt)
