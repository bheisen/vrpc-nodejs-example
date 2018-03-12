{
  'variables': {
    'vrpc_path': '<!(if [ -e ../vrpc ]; then echo ../vrpc; else echo node_modules/vrpc; fi)'
  },
  'targets': [
    {
      'target_name': 'vrpc_example',  # Name of the extension
      'defines': ['VRPC_COMPILE_AS_ADDON=<binding.cpp>'],  # Name of the binding file
      'cflags_cc!': ['-std=gnu++0x', '-fno-rtti', '-fno-exceptions'],
      'cflags_cc': ['-std=c++14', '-fPIC'],
      'include_dirs': [  # Include dirs needing to be found
        '<(vrpc_path)/cpp',
        'cpp'
      ],
      'sources': [  # Sources needing to be compiled
        '<(vrpc_path)/cpp/addon.cpp',
        'cpp/Bar.cpp'
      ],
      'link_settings': {
        'libraries': [  # System library dependencies, e.g.
          # '-lpthread'
        ],
        'ldflags': [  # Linker flags
          '-Wl,-rpath,\$$ORIGIN' #  Makes us relocatable
          # '-Wl,-rpath,\$$ORIGIN/runtime/path/to/local/lib',
          # '-L<!(pwd)/compiletime/path/to/local/lib'
        ]
      },
      'libraries': ['-Wl,-rpath,\$$ORIGIN'] #  Makes us relocatable
    }
  ]
}
