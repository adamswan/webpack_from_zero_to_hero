import "./css/page.css";
import "./less/pageB.less";

const btn = document.querySelector(".btn1");

btn.addEventListener("click", () => {
  import(/* webpackChunkName: "gaoyuanyuan" */ "./count.js")
    .then((module) => {
      console.log("动态导入的count模块中的高圆圆", module.wife);
    })
    .catch((err) => {
      console.error(err);
    });
});
