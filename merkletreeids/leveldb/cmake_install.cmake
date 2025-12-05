# Install script for directory: C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/Program Files/leveldb")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/Debug/leveldb.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/Release/leveldb.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/MinSizeRel/leveldb.lib")
  elseif(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/RelWithDebInfo/leveldb.lib")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/leveldb" TYPE FILE FILES
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/c.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/cache.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/comparator.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/db.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/dumpfile.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/env.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/export.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/filter_policy.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/iterator.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/options.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/slice.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/status.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/table_builder.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/table.h"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/include/leveldb/write_batch.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb/leveldbTargets.cmake")
    file(DIFFERENT _cmake_export_file_changed FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb/leveldbTargets.cmake"
         "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/CMakeFiles/Export/f90a79f6c24c38ae6b0a9cccec147da8/leveldbTargets.cmake")
    if(_cmake_export_file_changed)
      file(GLOB _cmake_old_config_files "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb/leveldbTargets-*.cmake")
      if(_cmake_old_config_files)
        string(REPLACE ";" ", " _cmake_old_config_files_text "${_cmake_old_config_files}")
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb/leveldbTargets.cmake\" will be replaced.  Removing files [${_cmake_old_config_files_text}].")
        unset(_cmake_old_config_files_text)
        file(REMOVE ${_cmake_old_config_files})
      endif()
      unset(_cmake_old_config_files)
    endif()
    unset(_cmake_export_file_changed)
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb" TYPE FILE FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/CMakeFiles/Export/f90a79f6c24c38ae6b0a9cccec147da8/leveldbTargets.cmake")
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb" TYPE FILE FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/CMakeFiles/Export/f90a79f6c24c38ae6b0a9cccec147da8/leveldbTargets-debug.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb" TYPE FILE FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/CMakeFiles/Export/f90a79f6c24c38ae6b0a9cccec147da8/leveldbTargets-minsizerel.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb" TYPE FILE FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/CMakeFiles/Export/f90a79f6c24c38ae6b0a9cccec147da8/leveldbTargets-relwithdebinfo.cmake")
  endif()
  if(CMAKE_INSTALL_CONFIG_NAME MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb" TYPE FILE FILES "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/CMakeFiles/Export/f90a79f6c24c38ae6b0a9cccec147da8/leveldbTargets-release.cmake")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/leveldb" TYPE FILE FILES
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/cmake/leveldbConfig.cmake"
    "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/cmake/leveldbConfigVersion.cmake"
    )
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/third_party/googletest/cmake_install.cmake")
  include("C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/third_party/benchmark/cmake_install.cmake")

endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
if(CMAKE_INSTALL_COMPONENT)
  if(CMAKE_INSTALL_COMPONENT MATCHES "^[a-zA-Z0-9_.+-]+$")
    set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
  else()
    string(MD5 CMAKE_INST_COMP_HASH "${CMAKE_INSTALL_COMPONENT}")
    set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INST_COMP_HASH}.txt")
    unset(CMAKE_INST_COMP_HASH)
  endif()
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "C:/Users/Jabir/WebstormProjects/Voting/merkletreeids/leveldb/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
