{
    "targets": [
        {
            "target_name": "kcp",
            "include_dirs": ["<!(node -e \"require('nan')\")"],
            "sources": ["include/ikcp.cc", "include/kcpobject.cc", "include/node-kcp.cc"],
        }
    ]
} # type: ignore
