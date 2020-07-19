# API Documentation

Requirement :
1. Ensure `node (>8.6 and <= 10)` and `npm` are installed
2. run `npm install` in root directory

To see a web page version please run this in terminal

```
npm run doc
```

Then open web browser at [http://localhost:3000/](http://localhost:3000)

To generate apidoc, there is dependencies that is required :

```
npm install apidoc -g
```

after installation you can generate the api documentation with this command from root directory
```
apidoc -i src 
```

for more information about apidoc generator, visit [https://apidocjs.com/](https://apidocjs.com/)