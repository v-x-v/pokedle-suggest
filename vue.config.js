const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  publicPath: "/pokedle-suggest/",
  devServer: {
    port: 8080,
    allowedHosts: "all",
  },
  pages: {
    index: {
      entry: "src/main.ts",
      title: "v-x-v tools",
    },
  },
});
