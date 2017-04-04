const Container = PIXI.Container,
      autoDetectRenderer = PIXI.autoDetectRenderer,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      Sprite = PIXI.Sprite,
      TextureCache = PIXI.utils.TextureCache;
      Ticker = PIXI.ticker.shared;

Ticker.autoStart = false;

const backdropImg = "../assets/img/backdrop.jpg";
const animalsImg = "../assets/img/animals.json";

// create state

const renderer = autoDetectRenderer(800, 600, {antialias: false, transparent: false, resolution: 1, backgroundColor: 0x000000});
document.body.appendChild(renderer.view);
var stage = new Container();

// renderer.view.style.border = '1px dashed black';
renderer.view.style.position = "relative";
renderer.view.style.display = "block";
renderer.view.style.margin = "20px auto";
// renderer.autoResize = true;
// renderer.resize(window.innerWidth, window.innerHeight);

loader
  .add([backdropImg, animalsImg])
  .on("progress", loadProgressHandler)
  .load(setup);



// create state items

var cat, hedgehog, tiger, id, cats, healthBar, message, catHitCount, hedgehogHitCount, tigerHitCount, state, gameOverScene, gameScene, secondsCount;

function setup() {
  console.log("All files loaded, setup");

  const background = new Sprite(resources[backdropImg].texture);
  background.width = renderer.width;
  background.height = renderer.height;
  stage.addChild(background);

  message = new PIXI.Text("Ready!", {font: "128px Futura", fill: "Orange"});
  message.x = stage.width / 2 - 50;
  message.y = stage.height / 2 - 32;
  stage.addChild(message);
  message.visible = false;


  gameScene = new Container();
  stage.addChild(gameScene);
  // gameScene.visible = false;

  const catTexture = TextureCache["cat.png"];
  cat = new Sprite(catTexture);
  cat.position.set(10, 5);
  cat.scale.set(.5, .5);
  gameScene.addChild(cat);

  catHitCount = new PIXI.Text(
    ": 0",
    {font: "16px Futura", fill: "blue"}
  );
  catHitCount.position.set(45, 10);
  gameScene.addChild(catHitCount);

  const hedgehogTexture = TextureCache["hedgehog.png"];
  hedgehog = new Sprite(hedgehogTexture);
  hedgehog.position.set(90, 5);
  hedgehog.scale.set(.5, .5);
  gameScene.addChild(hedgehog);

  hedgehogHitCount = new PIXI.Text(
    ": 0",
    {font: "16px Futura", fill: "blue"}
  );
  hedgehogHitCount.position.set(125, 10);
  gameScene.addChild(hedgehogHitCount);

  const tigerTexture = TextureCache["tiger.png"];
  tiger = new Sprite(tigerTexture);
  tiger.position.set(170, 5);
  tiger.scale.set(.5, .5);
  gameScene.addChild(tiger);

  tigerHitCount = new PIXI.Text(
    ": 0",
    {font: "16px Futura", fill: "blue"}
  );
  tigerHitCount.position.set(205, 10);
  gameScene.addChild(tigerHitCount);

  id = resources[animalsImg].textures;

  var numberOfCats = 12,
      spacing = 60,
      xOffset = 50,
      speed = 4,
      direction = 1;

  cats = [];

  for (var i = 0; i< numberOfCats; i++) {
    var aCat = new Sprite(id["cat.png"]);
    var x = spacing * i + xOffset;
    var y = randomInt(0, stage.height - aCat.height);
    aCat.position.set(x, y);
    aCat.vy = speed * direction;
    aCat.interactive = true;
    aCat.buttonMode = true;
    // aCat.on('pointerdown', onClick);
    aCat.on('click', onClick);
    aCat.on('tap', onClick);
    direction *= -1;
    cats.push(aCat);
    gameScene.addChild(aCat);
  }

  healthBar = new Container();
  healthBar.position.set(stage.width - 170, 6);
  gameScene.addChild(healthBar);

  var innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  var outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;



  gameOverScene = new Container();
  stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  message = new PIXI.Text(
    "Time out!",
    {font: "90px Futura", fill: "red"}
  );

  message.x = stage.width / 2 - 50;
  message.y = stage.height / 2 - 32;
  gameOverScene.addChild(message);

  state = play;
  setInterval(reduceHealth, 1000);
  Ticker.add(gameLoop);
  Ticker.start();
}

function gameLoop() {
  // requestAnimationFrame(gameLoop);
  state();
  renderer.render(stage);
}

function play() {
  cats.forEach(function (c) {
    c.y += c.vy;
    var cHitsWall = contain(c, {x: 0, y: 65, width: 800, height: 535});
    if (cHitsWall === "top" || cHitsWall === "bottom") {
      c.vy *= -1;
    }
  });
  setTimeout(end, 10000);
}

function end() {
  // message.visible = true;
  gameScene.visible = false;
  gameOverScene.visible = true;
}

function contain(sprite, container) {
  var collision = undefined;
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  return collision;
}

function loadProgressHandler(loader, resource) {
  console.log("loading:" + resource.url);
  console.log("progress:" + loader.progress + "%");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reduceHealth() {
  if (healthBar.outer.width <= 0) return;
  healthBar.outer.width -= (128 / 10);
}

function onClick() {
  const c = catHitCount.text.split(" ");
  catHitCount.text = ': ' + (parseInt(c[1], 10) + 1);
  this.scale.x *= 1.25;
  this.scale.y *= 1.25;
  setTimeout((function () {
    this.visible = false;
  }).bind(this), 500);
}
