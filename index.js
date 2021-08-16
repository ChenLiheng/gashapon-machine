$(function () {
  // 画布宽高
  const width = 750 / 2;
  const height = 1214 / 2;

  // 摇蛋区域宽高
  const machineWidth = 268;
  const machineHeight = 202;

  // 扭蛋区域四点坐标，上 → 左 → 下 → 右
  const points = [[187.5, 174], [60, 277], [187.5, 370], [318, 277]];

  let machineStatus = true;

  const sourceData = [
    { name: 'ball1', path: "./assets/images/ball_1@2x.png" },
    { name: 'ball2', path: "./assets/images/ball_2@2x.png" },
    { name: 'ball3', path: "./assets/images/ball_3@2x.png" },
    { name: 'ball4', path: "./assets/images/ball_4@2x.png" },
    { name: 'ball5', path: "./assets/images/ball_5@2x.png" },
    { name: 'ball6', path: "./assets/images/ball_6@2x.png" },
    { name: 'ball7', path: "./assets/images/ball_7@2x.png" },
    { name: 'ball8', path: "./assets/images/ball_8@2x.png" },
    { name: 'ball9', path: "./assets/images/ball_9@2x.png" },
    { name: 'ball10', path: "./assets/images/ball_10@2x.png" },
    { name: 'ball11', path: "./assets/images/ball_11@2x.png" },
    { name: 'ball12', path: "./assets/images/ball_12@2x.png" },
    { name: 'ball13', path: "./assets/images/ball_13@2x.png" },
    { name: 'imgBg', path: "./assets/images/main_gashapon_bg.jpg" },
    { name: 'mask', path: "./assets/images/bg_image_top@2x.png" },
    { name: 'btnStart', path: "./assets/images/btn_start@2x.png" },
  ]
  let sourceList = [];

  LInit(50, 'gashapon', width, height, main);

  function main() {
    LGlobal.setDebug(true);
    LGlobal.box2d = new LBox2d();
    backLayer = new LSprite();
    addChild(backLayer);

    LLoadManage.load(
      sourceData,
      function (progress) {
      },
      function (result) {
        sourceList = result;
        gameInit();
      },
      function (error) {
        console.log(error)
      }
    );
  }

  function gameInit() {
    const bgLayer = new LSprite();
    bgLayer.graphics.drawRect(0, "#000000", [0, 0, width, height], true, "#cccc80");
    const bgBitmap = new LBitmap(new LBitmapData(sourceList.imgBg));
    bgBitmap.scaleX = 0.5;
    bgBitmap.scaleY = 0.5;
    // bgLayer.alpha = 0.3;
    bgLayer.addChild(bgBitmap);
    backLayer.addChild(bgLayer);

    // 上墙体
    const upWallLayer = new LSprite();
    upWallLayer.x = points[0][0];
    upWallLayer.y = points[0][1];
    backLayer.addChild(upWallLayer);
    upWallLayer.addBodyPolygon(machineWidth, 10, 0);

    // 左墙体
    const leftWallLayer = new LSprite();
    leftWallLayer.x = points[1][0];
    leftWallLayer.y = points[1][1];
    backLayer.addChild(leftWallLayer);
    leftWallLayer.addBodyPolygon(10, machineHeight, 0);

    // 下墙体
    const downWallLayer = new LSprite();
    downWallLayer.x = points[2][0];
    downWallLayer.y = points[2][1];
    downWallLayer.addBodyPolygon(machineWidth, 10, 0);
    backLayer.addChild(downWallLayer);

    // 右墙体
    const rightWallLayer = new LSprite();
    rightWallLayer.x = points[3][0];
    rightWallLayer.y = points[3][1];
    backLayer.addChild(rightWallLayer);
    rightWallLayer.addBodyPolygon(10, machineHeight, 0);

    // 添加小球
    for (let i = 0; i < sourceData.length; i++) {
      const ballData = sourceData[i];
      if (ballData.name.indexOf('ball') >= 0) {
        const ball = new Ball(sourceList[ballData.name]);
        backLayer.addChild(ball);
      }
    }

    // 添加遮罩
    const mask = new LBitmap(new LBitmapData(sourceList['mask']));
    mask.x = 55;
    mask.y = 179;
    backLayer.addChild(mask);

    const radioTextField = new LTextField();
    radioTextField.x = 90;
    radioTextField.y = 424;
    radioTextField.color = '#ffffff';
    radioTextField.text = '法外狂徒张三获得一个红包';
    backLayer.addChild(radioTextField);

    // 启动按钮
    const btnStartBitmap = new LBitmap(new LBitmapData(sourceList['btnStart']));
    btnStartBitmap.scaleX = 0.5;
    btnStartBitmap.scaleY = 0.5;
    const btnStartLayer = new LSprite();
    btnStartLayer.addChild(btnStartBitmap);
    btnStartLayer.x = 130;
    btnStartLayer.y = 465;
    backLayer.addChild(btnStartLayer);
    btnStartLayer.addEventListener(LMouseEvent.MOUSE_DOWN, onStart)
  }

  function onStart() {

    if (!machineStatus) {
      return;
    }
    machineStatus = false;
    start(3000).then(() => {
      machineStatus = true;
      // 展示奖励
      showResult();
    });
  }

  function start(timeout) {
    const balls = backLayer.childList.filter(item => item.name == 'ball');
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      // 施加一个作用力
      ball.box2dBody.GetWorld().DestroyBody(ball.box2dBody);
      ball.addBodyCircle(ball.getWidth() * 0.3, ball.getWidth() * 0.5, ball.getWidth() * 0.5, 0, 1, 0.1, 1.6);
      ball.box2dBody.SetType(2);
      ball.box2dBody.ApplyImpulse(new LGlobal.box2d.b2Vec2(9, 15), ball.box2dBody.GetWorldCenter())
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('停止')
        for (let i = 0; i < balls.length; i++) {
          const ball = balls[i];
          // 施加一个作用力
          ball.box2dBody.GetWorld().DestroyBody(ball.box2dBody);
          ball.addBodyCircle(ball.getWidth() * 0.3, ball.getWidth() * 0.5, ball.getWidth() * 0.5, 1, 1, 0.1, 0.1);
          ball.box2dBody.SetAwake(true);
          ball.box2dBody.SetLinearVelocity(new LGlobal.box2d.b2Vec2(0, 10));
          resolve();
        }
      }, timeout);
    })
  }

  function showResult() {
    // 弹窗展示
    $('#reward-pop').show();
    $('.ball-up').show().addClass('ball-up-animate');
    $('.ball-down').show().addClass('ball-down-animate');
    $('.ball-up').delay(1000).animate({ top: '150px' }, 100, function () {
      $(this).fadeOut(300);
      $(this).removeClass('ball-up-animate');
    });
    $('.ball-down').delay(1000).animate({ top: '396px' }, 100, function () {
      $(this).fadeOut(300);
      $(this).removeClass('ball-down-animate');
    });

    $('.reward').delay(1400).show(0, function () {
      $(this).animate({ zoom: 2 }, 100);
      $('.receive-btn').fadeIn(100);
      $('.receive-btn').click(function () {
        $('#reward-pop').hide();
        $('.reward').delay(100).animate({ zoom: 1 });
        $('.reward').hide();
        $('.ball-up').animate({ top: '243px' });
        $('.ball-down').animate({ top: '303px' });
        $(this).hide();
      })
    });
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function onFrame() {
    LGlobal.box2d.setEvent(LEvent.POST_SOLVE, postSolve);
  }

  function postSolve(contact, impulse) {
    if (contact.GetFixtureA().GetBody().GetUserData().hit) contact.GetFixtureA().GetBody().GetUserData().hit(impulse.normalImpulses[0]);
    if (contact.GetFixtureB().GetBody().GetUserData().hit) contact.GetFixtureB().GetBody().GetUserData().hit(impulse.normalImpulses[0]);
  }

  function Ball(src) {
    const ballLayer = new LSprite();
    ballLayer.name = 'ball';
    const ballMaxDia = 76;  // 最大小球直径
    ballLayer.x = random(points[1][0], points[3][0] - ballMaxDia);
    ballLayer.y = points[2][1] - 100;

    const bitmap = new LBitmap(new LBitmapData(src));
    const bodyR = bitmap.getWidth() * 0.3;
    const bodyX = bitmap.getWidth() * 0.5;
    const bodyY = bitmap.getHeight();

    const bodyLayer = new LSprite();
    bodyLayer.x = bitmap.getWidth() * -0.2;
    bodyLayer.y = bitmap.getHeight() * -0.2;
    bodyLayer.addChild(bitmap);
    ballLayer.addChild(bodyLayer);
    ballLayer.addBodyCircle(bodyR, bodyX, bodyY, 1, 1, 0.1, 0.1);
    ballLayer.box2dBody.SetAngle(Math.random() * 180);
    return ballLayer;
  }

});