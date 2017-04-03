/**
 * Created by noah.r on 03/04/2017.
 */
const Container = PIXI.Container,
      autoDetectRenderer = PIXI.autoDetectRenderer,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      Sprite = PIXI.Sprite,
      TextureCache = PIXI.utils.TextureCache;

// const backdropImg = "../assets/img/backdrop.jpg";


const renderer = autoDetectRenderer(800, 600, {antialias: false, transparent: false, resolution: 1, backgroundColor: 0x000000});
document.body.appendChild(renderer.view);
const stage = new Container();
// renderer.render(stage);

// set stage style

// renderer.view.style.border = '1px dashed black';
renderer.view.style.position = "relative";
renderer.view.style.display = "block";
renderer.view.style.margin = "20px auto";
// renderer.autoResize = true;
// renderer.resize(window.innerWidth, window.innerHeight);


loader
  .add(["../assets/img/backdrop.jpg", "../assets/img/animals.png"])
  .on("progress", loadProgressHandler)
  .load(setup);

function setup() {
  console.log("All files loaded, setup");
  const background = new Sprite(resources["../assets/img/backdrop.jpg"].texture);
  background.width = renderer.width;
  background.height = renderer.height;
  stage.addChild(background);
  renderer.render(stage);
}

function loadProgressHandler(loader, resource) {
  console.log("loading:" + resource.url);
  console.log("progress:" + loader.progress + "%");
}