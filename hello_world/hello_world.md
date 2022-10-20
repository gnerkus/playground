# Basic compilation
## 1. Compile the code with Emscripten
```bash
emcc hello_world.c
```
This should output two files in the root directory: `a.out.js` and `a.out.wasm`.

## 2. Run the compiled file via Node
```bash
node a.out.js
```

This should print "hello, world!" to the console.

# HTML generation
## 1. Compile the code with Emscripten
```bash
emcc hello_world.c -o hello.html
```
This should output three files in the root directory: `hello.js`, `hello.wasm` and `hello.html`.

## 2. Open the HTML file in a web server
Navigate to the root of the project and type:
```bash
python3 -m http.server 3000
```

This should serve all the files in the directory in a http server on port 3000.

## 3. Navigate to http://localhost:3000/hello.html
