module.exports = {
    "pipeline": [
      [
        "@pika/plugin-ts-standard-pkg"
      ],
      [
        "@pika/plugin-build-node"
      ],
      [
        "@pika/plugin-simple-bin",
        {
          "bin": "pika-pack",
          "minNodeVersion": 8
        }
      ],
      [
        "@pika/plugin-simple-bin",
        {
          "bin": "pack",
          "minNodeVersion": 8
        }
      ]
    ]
  }