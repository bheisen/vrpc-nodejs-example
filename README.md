# VRPC Example - Node.js
[![Build Status](https://travis-ci.org/bheisen/vrpc-nodejs-example.svg?branch=master)](https://travis-ci.org/bheisen/vrpc-nodejs-example)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/bheisen/vrpc-nodejs-example/master/LICENSE)
[![GitHub Releases](https://img.shields.io/github/tag/bheisen/vrpc-nodejs-example.svg)](https://github.com/bheisen/vrpc-nodejs-example/tag)


This project shows how you can easily bind some C++ code and use it from within
Node.js.

## How to run this example

Start with cloning or downloading this project from github.

### 1. Using docker

Using docker the installation is really simple and needs - besides docker -
no dependencies on your system.

1. Build a docker image using the provided `Dockerfile`, e.g.:

    ```
    docker build . -t vrpc-nodejs-example
    ```

2. The run the example by typing:

    ```
    docker run vrpc-nodejs-example
    ```

### 2. On your operating system

For a local installation, make sure you have Node.js 8 and a C++14 capable
compiler installed.

1. Install, using:
    ```
    npm install
    ```

2. Run
    ```
    npm start
    ```

## How does this work?

The basic idea is that the C++ code in this project (`cpp/Bar.hpp` and
`cpp/Bar.cpp`) is compiled together with the `cpp/binding.cpp` file (which
expresses what to bind) and some sources from
[vrpc](https://github.com/bheisen/vrpc) into a regular native addon.

Technically, this addon works like a factory, able to instantiate all
registered classes and call corresponding functions on them. To use it in
Node.js, you need to construct an instance of `Vrpc`, giving it the
addon as argument:

```javascript
const Vrpc = require('vrpc')
const addon = require('./build/Release/vrpc_example')  // <-- compiled c++ addon

// Create an instance of a local (native-addon) vrpc factory
const vrpc = Vrpc(addon)

// Now vrpc is much like a factory, capable to create C++ instances
// and provide you with a proxy for interacting

const proxyOfCppInstance = vrpc.create('Bar')
```

For all other details, please refer to the [documentation of
vrpc](https://github.com/bheisen/vrpc#readme)


## Writing a proper `binding.gyp`

For the binding to work it is important to have a proper `binding.gyp`:

```python
{
  'variables': {
    'vrpc_path': '<!(if [ -e ../vrpc ]; then echo ../vrpc/vrpc; else echo node_modules/vrpc/vrpc; fi)'
  },
  'targets': [
    {
      'target_name': 'vrpc_example',  # Name of the extension
      'defines': ['VRPC_COMPILE_AS_ADDON=<binding.cpp>'],  # Name of the binding file
      'cflags_cc!': ['-std=gnu++0x', '-fno-rtti', '-fno-exceptions'],
      'cflags_cc': ['-std=c++14', '-fPIC'],
      'include_dirs': [  # Include dirs needing to be found
        '<(vrpc_path)',
        'cpp'
      ],
      'sources': [  # Sources needing to be compiled
        '<(vrpc_path)/addon.cpp',
        'cpp/Bar.cpp'
      ],
      'link_settings': {
        'libraries': [  # System library dependencies, e.g.
          # '-lpthread'
        ],
        'ldflags': [  # Linker flags
          # '-Wl,-rpath,\$$ORIGIN/runtime/path/to/local/lib',
          # '-L<!(pwd)/compiletime/path/to/local/lib'
        ]
      },
    }
  ]
}
```

Besides compiling sources within your project you can also write a `binding.cpp`
file that works on an existing third-party c++ library. You then only have to
link against this library as the comments in the above file indicate.
