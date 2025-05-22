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

// 尝试注册 serviceWorker，注册成功后才能使用PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("serviceWorker注册成功", registration);
      })
      .catch((err) => {
        console.error("serviceWorker注册失败", err);
      });
  });
}
